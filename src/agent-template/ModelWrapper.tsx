// ModelWrapper.ts
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { BaseInvokeModel, ToolCallingAdapter } from './ToolCallingAdapter';
import { ToolInterface } from '@langchain/core/tools';

interface LLMConfig {
  endpoint: string;
  apiKey: string;
  modelName: string;
  supportsTools?: boolean;
  headers?: Record<string, string>;
}

export class GenericLLMWrapper implements BaseInvokeModel {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = {
      supportsTools: false,
      headers: {},
      ...config,
    };
  }

  private normalizeMessages(
    messages: BaseMessage[]
  ): { role: string; content: string }[] {
    // Извлекаем первое системное сообщение, игнорируем остальные
    const systemMessages = messages.filter((m) => m.getType() === 'system');
    const nonSystemMessages = messages.filter((m) => m.getType() !== 'system');
    const firstSystemMessage =
      systemMessages[0] || new AIMessage('', { type: 'system' });
    return [
      { role: 'system', content: firstSystemMessage.content as string },
      ...nonSystemMessages.map((msg) => {
        if (msg instanceof HumanMessage)
          return { role: 'user', content: msg.content as string };
        if (msg instanceof AIMessage)
          return { role: 'assistant', content: msg.content as string };
        return { role: 'user', content: msg.content as string };
      }),
    ];
  }

  private preparePayload(
    messages: BaseMessage[],
    tools?: ToolInterface[],
    tool_choice?: 'auto' | 'required'
  ) {
    const payload = {
      model: this.config.modelName,
      messages: this.normalizeMessages(messages),
      temperature: 0.1,
    };
    return tools
      ? {
          ...payload,
          tools: tools.map((tool) => ({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description || '',
              parameters: tool.schema || { type: 'object', properties: {} },
            },
          })),
          tool_choice,
        }
      : payload;
  }

  async invoke(
    input: { messages: BaseMessage[] } | BaseMessage[],
    options?: {
      tools: ToolInterface[];
      tool_choice: 'auto' | 'required';
    }
  ): Promise<any> {
    const messages = Array.isArray(input) ? input : input.messages;
    const payload = this.preparePayload(
      messages,
      options?.tools,
      options?.tool_choice
    );

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
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

    const message = data.choices?.[0]?.message || {
      content: data.content?.[0]?.text || '',
    };
    if (message.tool_calls) {
      return new AIMessage({
        content: message.content || '',
        tool_calls: message.tool_calls.map((tc: any) => ({
          id: tc.id || crypto.randomUUID(),
          type: 'tool_call',
          name: tc.function.name,
          args:
            typeof tc.function.arguments === 'string'
              ? tc.function.arguments
              : JSON.stringify(tc.function.arguments),
        })),
      });
    }
    return new AIMessage(message.content || '');
  }

  bindTools(
    tools: any[],
    options: { tool_choice?: any } = { tool_choice: 'auto' }
  ) {
    if (this.config.supportsTools) {
      return {
        invoke: async (input: any) => {
          return this.invoke(input, {
            tools,
            tool_choice: options.tool_choice,
          });
        },
      };
    } else {
      return new ToolCallingAdapter(this).bindTools(tools, options);
    }
  }
}
