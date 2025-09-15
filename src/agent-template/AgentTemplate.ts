import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { VerboseAgentLogger } from '@/tools/logger';
import { AgentOptions, AgentState } from './AgentTemplate.types';
import { callModel, wrapToolsForLogger } from './AgentTemplate.utils';

export class CustomAgent {
  protected model: BaseLanguageModel;
  protected tools: ToolInterface[];
  protected compiledGraph: Runnable<AgentState, any>;
  protected logger: VerboseAgentLogger;

  private chatHistory: BaseMessage[] = [];

  constructor(options: AgentOptions) {
    this.model = options.model;

    const wrappedTools = wrapToolsForLogger(options.tools, options.logger);

    this.tools = wrappedTools;
    this.logger = options.logger;
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
      callModel({
        model: this.model,
        tools: this.tools,
        systemPromptText,
        state,
        logger: this.logger,
      })
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
