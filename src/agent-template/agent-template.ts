import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ToolCallingAdapter } from './ToolCallingAdapter';

// --- 1. Определение типа состояния агента ---
// Используем интерфейс для большей ясности
export interface AgentState {
  messages: BaseMessage[];
}

// --- 1.1. Единый интерфейс для всех типов моделей ---
export interface UnifiedModel {
  invoke(input: { messages: BaseMessage[] } | BaseMessage[]): Promise<AIMessage>;
}

// --- 1.2. Функция для создания единой модели с инструментами ---
export function createUnifiedModelWithTools(
  model: BaseLanguageModel,
  tools: ToolInterface[]
): UnifiedModel {
  console.log('[DEBUG] Создание единой модели с инструментами:', {
    modelType: model?.constructor?.name,
    hasBindTools: typeof (model as any)?.bindTools === 'function',
    hasWithTools: typeof (model as any)?.withTools === 'function',
    hasWithFunctions: typeof (model as any)?.withFunctions === 'function',
    hasBind: typeof (model as any)?.bind === 'function',
  });

  // Пробуем нативные методы LangChain
  if (typeof (model as any)?.bindTools === 'function') {
    try {
      const boundModel = (model as any).bindTools(tools, { tool_choice: 'auto' });
      console.log('[INFO] Используется bindTools');
      return {
        invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
          const messages = Array.isArray(input) ? input : input.messages;
          return await boundModel.invoke({ messages });
        }
      };
    } catch (e: any) {
      console.warn('[WARN] bindTools не сработал:', e?.message ?? e);
    }
  }

  if (typeof (model as any)?.withTools === 'function') {
    try {
      const boundModel = (model as any).withTools(tools);
      console.log('[INFO] Используется withTools');
      return {
        invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
          const messages = Array.isArray(input) ? input : input.messages;
          return await boundModel.invoke({ messages });
        }
      };
    } catch (e: any) {
      console.warn('[WARN] withTools не сработал:', e?.message ?? e);
    }
  }

  if (typeof (model as any)?.withFunctions === 'function') {
    try {
      const boundModel = (model as any).withFunctions(tools);
      console.log('[INFO] Используется withFunctions');
      return {
        invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
          const messages = Array.isArray(input) ? input : input.messages;
          return await boundModel.invoke({ messages });
        }
      };
    } catch (e: any) {
      console.warn('[WARN] withFunctions не сработал:', e?.message ?? e);
    }
  }

  if (typeof (model as any)?.bind === 'function') {
    try {
      const boundModel = (model as any).bind({ tools, tool_choice: 'auto' });
      console.log('[INFO] Используется bind');
      return {
        invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
          const messages = Array.isArray(input) ? input : input.messages;
          return await boundModel.invoke({ messages });
        }
      };
    } catch (e: any) {
      console.warn('[WARN] bind не сработал:', e?.message ?? e);
    }
  }

  // Fallback: используем ToolCallingAdapter
  console.log('[INFO] Используется ToolCallingAdapter');
  const adapter = new ToolCallingAdapter(model as any);
  const adaptedModel = adapter.bindTools(tools, { tool_choice: 'auto' });

  return {
    invoke: async (input: { messages: BaseMessage[] } | BaseMessage[]) => {
      return await adaptedModel.invoke(input);
    }
  };
}

// --- 2. Интерфейс для опций агента (с опциональным графом) ---
interface AgentOptions {
  model: BaseLanguageModel;
  tools: ToolInterface[];
  systemPrompt: string;
  /**
   * Опциональный, предварительно созданный граф LangGraph.
   * Если не предоставлен, будет создан стандартный ReAct-граф.
   */
  graph?: StateGraph<any>;
}

// --- 3. Базовый класс CustomAgent ---
export class CustomAgent {
  protected model: BaseLanguageModel;
  protected tools: ToolInterface[];
  protected compiledGraph: Runnable<AgentState, any>;
  protected unifiedModel: UnifiedModel;

  private chatHistory: BaseMessage[] = [];

  constructor(options: AgentOptions) {
    this.model = options.model;
    this.tools = options.tools;

    // Создаем единую модель с инструментами
    this.unifiedModel = createUnifiedModelWithTools(this.model, this.tools);

    let graph: StateGraph<any>;

    // ✨ Проверяем, был ли предоставлен кастомный граф
    if (options.graph) {
      console.log('[INFO] Используется предоставленный кастомный граф.');
      graph = options.graph;
    } else {
      // Если нет, создаем стандартный ReAct граф
      console.log(
        '[INFO] Кастомный граф не найден, создается стандартный ReAct-граф.'
      );
      graph = this.createDefaultGraph(options.systemPrompt);
    }

    this.compiledGraph = graph.compile();
  }

  // --- 4. Метод для создания стандартного ReAct-графа (используется по умолчанию) ---
  protected createDefaultGraph(
    systemPromptText = 'You are a helpful AI assistant.'
  ): StateGraph<AgentState> {
    const workflow = new StateGraph<AgentState>({
      channels: {
        messages: {
          value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
          default: () => [],
        },
      },
    });

    // Узлы графа используют методы этого класса.
    // Это позволяет кастомным графам также вызывать их.
    workflow.addNode('agent', (state) =>
      this.callModel(systemPromptText, state)
    );
    workflow.addNode('action', new ToolNode(this.tools));

    // Определяем логику переходов для ReAct-цикла
    workflow.addEdge(START, 'agent' as any);
    workflow.addConditionalEdges(
      'agent' as any,
      this.shouldContinue.bind(this),
      {
        continue: 'action' as any,
        end: END,
      }
    );
    workflow.addEdge('action' as any, 'agent' as any); // Ключевая связь для замыкания цикла

    return workflow;
  }

  // --- 6. Логика условного перехода (может использоваться в кастомных графах) ---
  public shouldContinue(state: AgentState): 'continue' | 'end' {
    const lastMessage = state.messages[state.messages.length - 1];

    if (
      lastMessage instanceof AIMessage &&
      lastMessage.tool_calls &&
      lastMessage.tool_calls.length > 0
    ) {
      console.log('[DEBUG] Решение: Продолжить (вызвать инструмент)');
      return 'continue';
    }

    console.log('[DEBUG] Решение: Завершить');
    return 'end';
  }

  // --- 7. Метод для запуска агента ---
  public async invoke(
    input: string,
    config?: RunnableConfig
  ): Promise<AgentState> {
    const userMessage = new HumanMessage(input);

    const finalState = await this.compiledGraph.invoke(
      {
        messages: [...this.chatHistory, userMessage],
      },
      config
    );

    this.chatHistory = finalState.messages;
    return finalState;
  }

  public getHistory(): BaseMessage[] {
    return this.chatHistory;
  }

  public setHistory(history: BaseMessage[]): void {
    this.chatHistory = history;
  }

  public resetHistory(): void {
    this.chatHistory = [];
  }

  public addMessagesToHistory(messages: BaseMessage[]): void {
    this.chatHistory.push(...messages);
  }

  // --- 8. Метод для вызова модели (используется в графах) ---
  public async callModel(
    systemPromptText: string,
    state: AgentState
  ): Promise<Partial<AgentState>> {
    console.log('\n--- [DEBUG] Вызов узла "agent" ---');

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptText),
      new MessagesPlaceholder('messages'),
    ]);

    const chain = prompt.pipe(this.unifiedModel as any);

    try {
      const response = (await chain.invoke({
        messages: state.messages,
      })) as AIMessage;

      console.log('[DEBUG] Ответ модели:', response);
      if (!response?.tool_calls || response.tool_calls.length === 0) {
        console.log(
          '[INFO] Модель не запросила инструмент (tool_calls пусты). Возможно, нужен адаптер/усиление промпта или другой провайдер.'
        );
      }
      if (response?.tool_calls?.length) {
        console.log(
          '[DEBUG] Обнаружены tool_calls:',
          (response as any).tool_calls
        );
      }

      return { messages: [response] };
    } catch (error: any) {
      console.error('[ERROR] Ошибка в callModel:', error);
      return {
        messages: [
          new AIMessage(
            `Произошла ошибка при обращении к модели: ${error.message}`
          ),
        ],
      };
    }
  }
}

