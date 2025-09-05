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

  private chatHistory: BaseMessage[] = [];

  constructor(options: AgentOptions) {
    this.model = options.model;
    this.tools = options.tools;
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
    // workflow.addNode('agent', this.callModel.bind(this, systemPromptText));
    workflow.addNode('agent', (state) =>
      callModel(this.model, this.tools, systemPromptText, state)
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
}

export const ensureToolCalling = (model: any, tools: ToolInterface[]) => {
  const wrapIfNeeded = (candidate: any) => {
    if (typeof candidate === 'function') return candidate;
    if (candidate && typeof candidate.invoke === 'function') {
      return (input: any) => candidate.invoke(input);
    }
    return candidate;
  };

  console.log('[DEBUG] model caps:', {
    name: model?.constructor?.name,
    hasBindTools: typeof model?.bindTools === 'function',
    hasWithTools: typeof model?.withTools === 'function',
    hasWithFunctions: typeof model?.withFunctions === 'function',
    hasBind: typeof model?.bind === 'function',
  });

  // Универсально: сначала нативные пути (bindTools/withTools/withFunctions), иначе адаптер

  // Логируем только удачные применения, не намерения
  if (typeof model?.bindTools === 'function') {
    try {
      const m = model.bindTools(tools, { tool_choice: 'auto' });
      console.log('[INFO] bindTools применён.');
      return wrapIfNeeded(m);
    } catch (e: any) {
      console.warn('[WARN] bindTools не сработал, пробую другие варианты:', e?.message ?? e);
    }
  }

  if (typeof model?.withTools === 'function') {
    try {
      const m = model.withTools(tools);
      console.log('[INFO] withTools применён.');
      return wrapIfNeeded(m);
    } catch (e: any) {
      console.warn('[WARN] withTools не сработал, продолжаю:', e?.message ?? e);
    }
  }

  if (typeof model?.withFunctions === 'function') {
    try {
      const m = model.withFunctions(tools);
      console.log('[INFO] withFunctions применён.');
      return wrapIfNeeded(m);
    } catch (e: any) {
      console.warn('[WARN] withFunctions не сработал, продолжаю:', e?.message ?? e);
    }
  }

  console.log('[WARN] Не удалось привязать инструменты: вызываю ToolCallingAdapter.');
  const adapted = new ToolCallingAdapter(model as any).bindTools(tools, { tool_choice: 'auto' });
  return wrapIfNeeded(adapted);

  // console.log('[INFO] Не удалось привязать инструменты: возвращаю модель как есть.');

  // if (typeof model?.bind === 'function') {
  //   console.log('[INFO] Фолбэк: bind({...tools}).');
  //   return model.bind({ tools, tool_choice: 'auto' });
  // }
}

export const callModel = async (
  model: BaseLanguageModel,
  tools: ToolInterface[],
  systemPromptText: string,
  state: AgentState
): Promise<Partial<AgentState>> => {
  console.log('\n--- [DEBUG] Вызов узла "agent" ---');

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPromptText),
    new MessagesPlaceholder('messages'),
  ]);

  const modelWithTools = ensureToolCalling(model as any, tools);

  const chain = prompt.pipe(modelWithTools as BaseLanguageModel);

  try {
    const response = (await chain.invoke({
      messages: state.messages,
    })) as AIMessage;

    console.log('[DEBUG] Ответ модели:', response);
    if (!response?.tool_calls || response.tool_calls.length === 0) {
      console.log('[INFO] Модель не запросила инструмент (tool_calls пусты). Возможно, нужен адаптер/усиление промпта или другой провайдер.');
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
};
