// generic-llm-wrapper.ts
import { BaseInvokeModel } from './ToolCallingAdapter';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

interface LLMConfig {
   endpoint: string;
   apiKey: string;
   modelName: string;
   supportsTools?: boolean; // Флаг поддержки tool calling
   headers?: Record<string, string>;
   transformMessages?: (messages: BaseMessage[]) => any[]; // Адаптация сообщений
   extractResponse?: (response: any) => { content: string; tool_calls?: any[] }; // Извлечение ответа
}

export class GenericLLMWrapper implements BaseInvokeModel {
   private config: LLMConfig;
   private tools?: any[];
   private toolChoice?: any;

   constructor(config: LLMConfig) {
      this.config = {
         supportsTools: false, // По умолчанию false
         transformMessages: (messages: BaseMessage[]) =>
            messages.map((msg: any) => {
               if (msg && typeof msg === 'object' && 'role' in msg && 'content' in msg) {
                  return { role: (msg as any).role, content: (msg as any).content };
               }
               if (msg instanceof HumanMessage) {
                  return { role: 'user', content: msg.content };
               }
               if (msg instanceof AIMessage) {
                  return { role: 'assistant', content: msg.content };
               }
               return { role: 'assistant', content: (msg as any)?.content ?? '' };
            }),
         extractResponse: (response: any) => {
            if (response.data.choices?.[0]?.message) {
               const message = response.data.choices[0].message;
               return {
                  content: message.content || '',
                  tool_calls: message.tool_calls,
               };
            }
            return {
               content: response.data.content?.[0]?.text || '',
            };
         },
         ...config,
      };
   }

   bindTools(tools: any[], options: { tool_choice?: any } = { tool_choice: 'auto' }) {
      if (!this.config.supportsTools) {
         throw new Error('Модель не поддерживает нативный tool calling.');
      }
      this.tools = tools.map(tool => ({
         type: 'function',
         function: {
            name: tool.name,
            description: tool.description || '',
            parameters: tool.schema || { type: 'object', properties: {} },
         },
      }));
      this.toolChoice = options.tool_choice;
      return this;
   }

   async invoke(input: { messages: BaseMessage[] } | BaseMessage[]): Promise<any> {
      const messages = Array.isArray(input) ? input : input.messages;
      const payload = {
         model: this.config.modelName,
         messages: this.config.transformMessages!(messages),
         temperature: 0.1,
         // Передаём tools только если модель поддерживает tool calling
         ...(this.config.supportsTools && this.tools ? { tools: this.tools, tool_choice: this.toolChoice } : {}),
      };

      try {
         const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${this.config.apiKey}`,
               'Content-Type': 'application/json',
               ...this.config.headers,
            },
            body: JSON.stringify(payload),
         });
         if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
         }
         const data = await response.json();
         const result = this.config.extractResponse!({ data });
         if (this.config.supportsTools && result.tool_calls) {
            return new AIMessage({
               content: result.content || '',
               tool_calls: result.tool_calls.map((tc: any) => ({
                  id: tc.id || crypto.randomUUID(),
                  type: 'tool_call',
                  name: tc.function.name,
                  args: JSON.parse(tc.function.arguments),
               })),
            });
         }
         return result.content || result;
      } catch (err: unknown) {
         if (err instanceof Error) {
            throw new Error(`Ошибка в LLM API: ${err.message}`);
         }
         throw new Error('Ошибка в LLM API: Unknown error');
      }
   }
}