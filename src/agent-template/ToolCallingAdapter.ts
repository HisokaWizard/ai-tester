// ToolCallingAdapter.ts
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

// Функция для генерации UUID, совместимая с браузером
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface ToolSpec {
  name: string;
  description?: string;
  schema?: any;
  call: (input: any) => Promise<any>;
}

export interface BaseInvokeModel {
  invoke: (input: { messages: BaseMessage[] } | BaseMessage[]) => Promise<any>;
}

function normalizeMessages(
  input: { messages: BaseMessage[] } | BaseMessage[]
): BaseMessage[] {
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
  return trimmed
    .replace(/^```[a-zA-Z]*\n?/, '')
    .replace(/\n?```\s*$/, '')
    .replace(/^`+|`+$/g, '')
    .replace(/^\s*json\s*\n/i, '');
}

function tryExtractJsonWithToolCalls(text: string): any | null {
  const cleaned = stripCodeFences(text);
  let direct = safeJsonParse<any>(cleaned);
  if (direct && typeof direct === 'object') return direct;
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    direct = safeJsonParse<any>(cleaned.slice(1, -1));
    if (direct && typeof direct === 'object') return direct;
  }
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
      if (depth === 0) {
        end = i;
        break;
      }
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

  public bindTools(
    tools: ToolSpec[],
    options: {
      tool_choice?:
      | 'auto'
      | 'none'
      | 'required'
      | { type: 'tool'; name: string };
    } = { tool_choice: 'auto' }
  ) {
    tools.forEach((t, idx) => {
      if (!t?.name || typeof t.name !== 'string') {
        t.name = `tool_${idx}`;
      }
      if (
        !t.schema ||
        typeof t.schema !== 'object' ||
        t.schema.type !== 'object'
      ) {
        t.schema = {
          type: 'object',
          properties: { input: { type: 'string' } },
          required: ['input'],
        };
      }
    });

    const toolDescriptions = tools
      .map((t) => `- ${t.name}: ${t.description ?? 'No description'}`)
      .join('\n');

    const requireToolName =
      typeof options?.tool_choice === 'object' &&
        options.tool_choice?.type === 'tool'
        ? options.tool_choice.name
        : options?.tool_choice === 'required'
          ? tools[0]?.name // Первый инструмент по умолчанию
          : null;

    const systemInstruction =
      `Твоя задача — отвечать на запросы, используя инструменты, если это необходимо или указано.\n` +
      `Если инструмент нужен, верни JSON: {"tool_calls":[{"name":"tool_name","arguments":{...}}]}\n` +
      `Пример: {"tool_calls":[{"name":"${tools[0]?.name || 'example_tool'}","arguments":{"input":"запрос"}}]}\n` +
      `Требования: "tool_calls" — массив; "name" — из списка инструментов; "arguments" — JSON-объект.\n` +
      `Если инструмент не нужен, верни текст без JSON и Markdown.\n` +
      `Инструменты:\n${toolDescriptions}\n` +
      `${requireToolName ? `Обязательно вызови инструмент "${requireToolName}".` : 'Выбери подходящий инструмент или ответь текстом.'}`;

    return {
      invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
        const messages = normalizeMessages(input);
        // Удаляем все системные сообщения
        const nonSystem = messages.filter((m) => m.getType() !== 'system');
        // Берем последнее пользовательское сообщение
        const lastUserMessage =
          nonSystem.find((m) => m.getType() === 'human') ||
          nonSystem[nonSystem.length - 1];
        const augmented = [
          new SystemMessage(systemInstruction),
          ...nonSystem,
        ];

        try {
          console.log('[DEBUG] ToolCallingAdapter: Отправляем запрос к модели');
          console.log('[DEBUG] System instruction:', systemInstruction.substring(0, 200) + '...');

          const raw = await this.base.invoke(augmented);
          console.log('[DEBUG] Raw model response type:', typeof raw);
          console.log('[DEBUG] Raw model response content:', raw?.content?.substring(0, 200) + '...');

          const content: string =
            typeof raw === 'string' ? raw : (raw?.content ?? '');

          const parsed = tryExtractJsonWithToolCalls(content) as {
            tool_calls?: { name: string; arguments: any }[];
          } | null;

          console.log('[DEBUG] Parsed tool calls:', parsed);
          if (
            parsed &&
            Array.isArray(parsed.tool_calls) &&
            parsed.tool_calls.length > 0
          ) {
            console.log('[INFO] Найдены tool_calls:', parsed.tool_calls.length);

            const validTools = new Set(tools.map((t) => t.name));
            const invalidCalls = parsed.tool_calls.filter(
              (tc) => !validTools.has(tc.name)
            );
            if (invalidCalls.length > 0) {
              console.log('[DEBUG] Invalid tool calls:', invalidCalls);
              return new AIMessage('Ошибка: инструмент не найден.');
            }

            const toolCalls = parsed.tool_calls.map((tc) => ({
              id: generateUUID(),
              name: tc.name,
              args:
                typeof tc.arguments === 'string'
                  ? JSON.parse(tc.arguments)
                  : tc.arguments,
            }));

            console.log('[INFO] Создаем AIMessage с tool_calls:', toolCalls);
            const message = new AIMessage('');
            message.tool_calls = toolCalls;
            return message;
          }

          // Fallback: если требуется инструмент и модель не вернула tool_calls
          if (requireToolName && lastUserMessage instanceof HumanMessage) {
            console.log('[DEBUG] Forcing tool call for:', requireToolName);
            const message = new AIMessage('');
            message.tool_calls = [
              {
                id: generateUUID(),
                name: requireToolName,
                args: { input: lastUserMessage.content },
              },
            ];
            return message;
          }

          return new AIMessage(content);
        } catch (error: any) {
          console.error(
            '[ERROR] ToolCallingAdapter invoke error:',
            error.message
          );
          return new AIMessage(
            `Ошибка при обращении к модели: ${error.message}`
          );
        }
      },
    } as BaseInvokeModel;
  }
}
