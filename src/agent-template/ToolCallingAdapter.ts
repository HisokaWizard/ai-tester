import { AIMessage, BaseMessage } from '@langchain/core/messages';

export interface ToolSpec {
   name: string;
   description?: string;
   schema?: any;
   call: (input: any) => Promise<any>;
}

export interface BaseInvokeModel {
   invoke: (input: { messages: BaseMessage[] } | BaseMessage[]) => Promise<any>;
}

function normalizeMessages(input: { messages: BaseMessage[] } | BaseMessage[]): BaseMessage[] {
   return Array.isArray(input) ? input : input.messages;
}

function safeJsonParse<T>(text: string): T | null {
   try {
      return JSON.parse(text) as T;
   } catch {
      return null;
   }
}

function stripCodeFences(text: string): string {
   const trimmed = (text ?? '').trim();
   if (trimmed.startsWith('```')) {
      const withoutFirst = trimmed.replace(/^```[a-zA-Z]*\n?/, '');
      return withoutFirst.replace(/\n?```\s*$/, '');
   }
   return trimmed;
}

function tryExtractJsonWithToolCalls(text: string): any | null {
   const cleaned = stripCodeFences(text);
   const direct = safeJsonParse<any>(cleaned);
   if (direct && typeof direct === 'object') return direct;
   const idx = cleaned.indexOf('"tool_calls"');
   if (idx === -1) return null;
   let start = cleaned.lastIndexOf('{', idx);
   if (start === -1) return null;
   let depth = 0;
   let end = -1;
   for (let i = start; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
         depth--;
         if (depth === 0) { end = i; break; }
      }
   }
   if (end === -1) return null;
   const slice = cleaned.slice(start, end + 1);
   return safeJsonParse<any>(slice);
}

export class ToolCallingAdapter {
   private readonly base: BaseInvokeModel;

   constructor(baseModel: BaseInvokeModel) {
      this.base = baseModel;
   }

   public bindTools(tools: ToolSpec[], options?: { tool_choice?: 'auto' | 'none' | 'required' | { type: 'tool', name: string } }) {
      const toolDescriptions = tools
         .map(t => `- ${t.name}: ${t.description ?? ''}`)
         .join('\n');

      const requireToolName = typeof options?.tool_choice === 'object' && (options.tool_choice as any)?.type === 'tool'
         ? (options!.tool_choice as any).name
         : options?.tool_choice === 'required'
            ? '__any__'
            : null;

      const systemInstruction =
         `Твоя задача — при необходимости вызывать инструменты.\n` +
         `Формат ответа ДОЛЖЕН быть строго JSON без пояснений и без Markdown. НЕ добавляй никакой текст вокруг.\n` +
         `Если инструмент требуется, верни ровно:\n` +
         `{"tool_calls":[{"name":"<toolName>","arguments":{...}}]}\n` +
         `Если инструмент не нужен — верни обычный текст-ответ (без JSON).\n` +
         `Доступные инструменты:\n${toolDescriptions}`;

      return {
         invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
            const messages = normalizeMessages(input);
            const augmented = [
               // LangChain messages совместимы, модель вне LC может игнорировать roles
               { role: 'system', content: systemInstruction } as any,
               ...messages,
               ...(requireToolName
                  ? [{ role: 'system', content: requireToolName === '__any__' ? 'Обязательно вызови подходящий инструмент.' : `Обязательно вызови инструмент: ${requireToolName}` } as any]
                  : []),
            ];

            const raw = await this.base.invoke(augmented as any);
            const content: string = typeof raw === 'string' ? raw : raw?.content ?? '';

            const parsed = tryExtractJsonWithToolCalls(content) as { tool_calls?: { name: string; arguments: any }[] } | null;
            if (parsed && Array.isArray(parsed.tool_calls) && parsed.tool_calls.length > 0) {
               // Валидация: проверяем, что tool существует
               const validTools = new Set(tools.map(t => t.name));
               const invalidCalls = parsed.tool_calls.filter(tc => !validTools.has(tc.name));
               if (invalidCalls.length > 0) {
                  console.warn('[WARN] LLM вызвала несуществующий tool:', invalidCalls);
                  return new AIMessage('Ошибка: инструмент не найден.');
               }

               return new AIMessage({
                  content: '',
                  tool_calls: parsed.tool_calls.map(tc => ({
                     id: crypto.randomUUID(),
                     type: 'tool_call',
                     function: { // Совместимо с LangGraph
                        name: tc.name,
                        arguments: typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments),
                     },
                  })),
               } as any);
            }

            return new AIMessage(content);
         },
      } as BaseInvokeModel;
   }
}


