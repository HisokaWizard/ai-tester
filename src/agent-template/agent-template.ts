// custom-agent.ts

import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from '@langchain/core/prompts';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { StateGraph, END, START } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';
// Предполагаем, что существует или будет создан узел для выполнения инструментов
// Это может быть, например, часть @langchain/langgraph/prebuilt или ваша собственная реализация
import { ToolNode } from '@langchain/langgraph/prebuilt'; // Или ваша реализация
import {
  AIMessage,
  BaseMessage,
  BaseMessageChunk,
  HumanMessage,
} from '@langchain/core/messages';

// --- 1. Определение типа состояния агента ---
// Это позволяет гибко управлять состоянием внутри графа.
// Можно расширить для конкретных агентов.
const AgentAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y), // Как комбинировать сообщения
    default: () => [], // Начальное значение
  }),
  // Другие поля состояния могут быть добавлены здесь
  // Например: next: Annotation<string>, scratchpad: Annotation<string>
});

type AgentStateType = typeof AgentAnnotation.State;

// --- 2. Интерфейс для опций агента ---
interface AgentOptions {
  model: BaseLanguageModel; // Модель LLM
  systemPrompt?: string; // Системный промпт
  userPromptTemplate?: string; // Шаблон пользовательского промпта (необязательно, если логика сложнее)
  tools?: ToolInterface[]; // Список доступных инструментов
  graph?: StateGraph<any, any, any, any, any, any> | any; // Граф исполнения (опционально, если нужен кастомный)
  // agentType?: 'react' | 'plan-and-execute' | 'custom'; // Тип агента (можно использовать для внутренней логики)
  // Другие настройки, например, парсер вывода, настройки ретраера и т.д.
}

// --- 3. Базовый класс CustomAgent ---
export class CustomAgent {
  protected model: BaseLanguageModel;
  protected systemPromptTemplate: SystemMessagePromptTemplate;
  protected userPromptTemplate: HumanMessagePromptTemplate;
  protected tools: ToolInterface[];
  protected graph: StateGraph<any, any, any, any, any, any> | any;
  protected compiledGraph: Runnable; // Скомпилированный граф

  constructor(options: AgentOptions) {
    this.model = options.model;
    this.tools = options.tools || [];

    // Инициализация промптов с умными умолчаниями
    const systemPromptText =
      options.systemPrompt || 'You are a helpful AI assistant.';
    this.systemPromptTemplate =
      SystemMessagePromptTemplate.fromTemplate(systemPromptText);

    const userPromptText = options.userPromptTemplate || '{input}';
    this.userPromptTemplate =
      HumanMessagePromptTemplate.fromTemplate(userPromptText);

    // Инициализация или создание графа
    if (options.graph) {
      this.graph = options.graph;
    } else {
      this.graph = this.createDefaultGraph();
    }

    // Компиляция графа
    this.compiledGraph = this.graph.compile();
  }

  // --- 4. Метод для создания стандартного графа (например, ReAct-подобного) ---
  protected createDefaultGraph(): any {
    const workflow = new StateGraph(AgentAnnotation)
      .addNode('agent', this.callModel.bind(this)) // Узел вызова модели
      .addNode('action', new ToolNode(this.tools)); // Узел выполнения действий

    // Добавляем ребра
    workflow.addEdge(START, 'agent');
    workflow.addEdge('action', 'agent'); // После действия снова к агенту

    // Условное ребро: если есть инструмент для вызова, идем к действию, иначе завершаем
    workflow.addConditionalEdges('agent', this.shouldContinue.bind(this), {
      // Карта переходов
      continue: 'action',
      end: END,
    });

    return workflow;
  }

  // --- 5. Логика узла "agent" - вызов модели ---
  protected async callModel(
    state: typeof AgentAnnotation.State
  ): Promise<Partial<typeof AgentAnnotation.State>> {
    // Создаем промпт для модели
    // Для простоты используем ChatPromptTemplate, но можно реализовать более сложную логику
    const prompt = ChatPromptTemplate.fromMessages([
      this.systemPromptTemplate,
      new MessagesPlaceholder('messages'), // Здесь будут предыдущие сообщения
    ]);

    const chain = prompt.pipe(this.model);
    const response: BaseMessageChunk = await chain.invoke({
      messages: state.messages,
    });

    return { messages: [response] };
  }

  // --- 6. Логика условного перехода ---
  protected shouldContinue(state: AgentStateType): 'continue' | 'end' {
    const lastMessage = state.messages[state.messages.length - 1];
    // Простая проверка: если последнее сообщение от ИИ содержит вызов инструмента
    // В реальности логика будет зависеть от формата ответа модели (например, парсинг JSON)
    // или использования специальных парсеров из LangChain (например, ToolCallingAgentOutputParser)
    if (
      lastMessage instanceof AIMessage &&
      lastMessage.tool_calls &&
      lastMessage.tool_calls.length > 0
    ) {
      return 'continue';
    }
    return 'end';
  }

  // --- 7. Метод для запуска агента ---
  public async invoke(
    input: string | Record<string, any>,
    config?: RunnableConfig
  ): Promise<any> {
    let initialState: Partial<AgentStateType>;

    if (typeof input === 'string') {
      // Если вход - строка, оборачиваем её в сообщение пользователя
      initialState = { messages: [new HumanMessage(input)] };
    } else {
      // Предполагаем, что вход уже содержит структуру состояния или сообщения
      // Например: { messages: [...], otherStateField: ... }
      initialState = input as Partial<AgentStateType>;
    }

    const finalState = await this.compiledGraph.invoke(initialState, config);
    // Возвращаем финальное состояние или последнее сообщение
    return finalState;
    // Или, например: return finalState.messages[finalState.messages.length - 1].content;
  }

  // --- 8. Метод для асинхронного стриминга ---
  public async *stream(
    input: string | Record<string, any>,
    config?: RunnableConfig
  ): AsyncGenerator<any, any, unknown> {
    let initialState: Partial<AgentStateType>;

    if (typeof input === 'string') {
      initialState = { messages: [new HumanMessage(input)] };
    } else {
      initialState = input as Partial<AgentStateType>;
    }

    const chunks = await this.compiledGraph.stream(initialState, config);
    for await (const chunk of chunks) {
      yield chunk;
    }
  }
}
