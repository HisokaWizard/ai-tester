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
    workflow.addNode('agent', this.callModel.bind(this, systemPromptText));
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

  // --- 5. Логика узла "agent" - вызов модели ---
  public async callModel(
    systemPromptText: string,
    state: AgentState
  ): Promise<Partial<AgentState>> {
    console.log('\n--- [DEBUG] Вызов узла "agent" ---');

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptText),
      new MessagesPlaceholder('messages'),
    ]);

    // const modelWithTools = this.model.withConfig({
    //   configurable: {
    //     tools: this.tools,
    //   },
    // });
    const anyModel = this.model.withRetry() as any;
    const modelWithTools =
      'bindTools' in anyModel
        ? anyModel.bindTools(this.tools, { tool_choice: 'auto' })
        : anyModel
            .withConfig({
              configurable: {
                tools: this.tools,
              },
            })
            .bind({ tools: this.tools, tool_choice: 'auto' });

    const chain = prompt.pipe(modelWithTools);

    try {
      const response = (await chain.invoke({
        messages: state.messages,
      })) as AIMessage;

      console.log('[DEBUG] Ответ модели:', response);
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

`Оригинальный запрос пользователя: Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag.. Дополнение от Rag: --- Фрагмент 1 (Источник: /Users/hisokawizard/Projects/somnia_relay_viewer/src/widgets/QuizGenerator/QuizGenerator.prompt.ts) ---
    "options": ["Келпи", "Пегас", "Плотва", "Сполох"],
    "correctAnswer": "Плотва"
  },
  {
    "question": "Какая чародейка была основательницей и первой главой Ложи Чародеек?",
    "options": ["Йеннифэр из Венгерберга", "Трисс Меригольд", "Фрингилья Виго", "Филиппа Эйльхарт"],
    "correctAnswer": "Филиппа Эйльхарт"
  }
]

Ваш ответ ДОЛЖЕН начинаться с [ и заканчиваться ]. Не включайте в ответ никакой другой текст, комментарии или markdown-форматирование вроде \\\`\\\`\\\`json.
\`;


--- Фрагмент 2 (Источник: /Users/hisokawizard/Projects/somnia_relay_viewer/src/widgets/QuizGenerator/QuizGenerator.prompt.ts) ---
 * @param topic Тема викторины, например "История Древнего Рима".
 * @param persona Роль эксперта, например "опытный историк, специализирующийся на Римской Империи".
 * @param difficultyLevels Массив из 10 чисел (0-100), определяющий сложность каждого вопроса.
 */
export const getUniversalQuizPromptRu = (
  topic: string,
  persona: string,
  difficultyLevels: number[]
) => \`
Вы — \${persona}. Ваша главная задача — создать качественную викторину из 10 уникальных вопросов на тему: "\${topic}".

Сложность каждого вопроса определяется по шкале от 0 до 100, где 0 — это очень простой, базовый вопрос, а 100 — чрезвычайно сложный вопрос, требующий глубоких, экспертных знаний по теме "\${topic}".

Уровни сложности для 10 вопросов заданы в следующей последовательности: \${difficultyLevels.join(',')}. Вы ДОЛЖНЫ строго придерживаться этой последовательности.

---
ТРЕБОВАНИЯ К ФОРМАТУ ОТВЕТА:
Вы ДОЛЖНЫ вернуть ТОЛЬКО один валидный JSON-массив. Массив должен содержать ровно 10 объектов.

--- Фрагмент 3 (Источник: /Users/hisokawizard/Projects/somnia_relay_viewer/UsefulKnowledge.md) ---

### **6. GigaChat (Сбер)**

- **Особенности**: Глубокая поддержка русского языка, интеграция с Kandinsky для генерации изображений.
- **Доступ**: Бесплатный через Telegram-бота (\`https://t.me/gigachat_bot\`), но API требует регистрации через номер телефона.

---

### Важные замечания:

1. **Бесплатные лимиты**: У многих провайдеров (например, Google Gemini, Groq) есть дневные квоты на токены или запросы .
2. **Регистрация**: Для получения API-ключей часто требуется верификация через email или номер телефона .
3. **JS-библиотеки**: Для удобства используйте обёртки вроде \`huggingface.js\` или \`groq-sdk\`.

Для полного списка моделей и условий использования обратитесь к [репозиторию free-llm-api-resources](https://github.com/cheahjs/free-llm-api-resources) .


--- Фрагмент 4 (Источник: /Users/hisokawizard/Projects/somnia_relay_viewer/UsefulKnowledge.md) ---
Вот список LLM с открытым и бесплатным API, а также примеры их подключения на JavaScript:

---

### **1. Mistral AI**

- **Модели**: Mistral 7B, Mixtral 8x7B, Mistral Small/Large.
- **Особенности**: Высокая скорость обработки, поддержка мультимодальных задач.
- **Пример запроса на JavaScript**:

\`\`\`javascript
const fetch = require('node-fetch');
const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${process.env.MISTRAL_API_KEY}\`,
  },
  body: JSON.stringify({
    model: 'mistral-tiny',
    messages: [
      { role: 'user', content: 'Кто самый известный французский писатель?' },
    ],
  }),
}).then((response) => response.json());
\`\`\`

---

### **2. Google Gemini**

- **Модели**: Gemini Pro, Gemini Flash.
- **Особенности**: Бесплатный доступ до 1 млн токенов/день для некоторых моделей, требует API-ключ.
- **Пример генерации текста**:

\`\`\`javascript
`;
