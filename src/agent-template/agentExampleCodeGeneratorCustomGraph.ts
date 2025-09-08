// main.ts
import { ChatOpenAI } from '@langchain/openai';

import { AgentState, callModel, CustomAgent } from './agent-template';
import { ragRetrieverFunc } from '../tools/ragRetrieverTool';
import fs from 'fs';
import { END, START, StateGraph } from '@langchain/langgraph';
import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import { getBitcoinPrice } from '@/tools/getBitcoinPrice';
import { VECTOR_STORE_PATH } from '@/rag';

async function runAgentExample() {
  console.log('--- Запуск примера CustomAgent с RAG ---');

  const openRouterUrl = 'https://openrouter.ai/api/v1';
  const modelName = 'qwen/qwen3-coder';
  const apiKey = process.env.OPEN_ROUTER_API_KEY;

  const model = new ChatOpenAI({
    modelName,
    temperature: 0,
    configuration: {
      baseURL: openRouterUrl,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      apiKey,
    },
  });

  const tools: ToolInterface[] = [];

  const systemPrompt = `
    Вы профессиональный разработчик ПО, по профилю frontend + ai-agent.
    Вы созданы для того, чтобы писать лучший код в стеке frontend(react, typescript, rtkquery, ect.)
    Ваша задача выполнять все запросы пользователя и при необходимости обращаться к инструментам
  `;

  const customGraph = (
    model: BaseLanguageModel,
    tools: ToolInterface[],
    systemPromptText: string
  ): StateGraph<any> => {
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
    workflow.addNode('agent', (state: AgentState) => {
      return callModel(model, tools, systemPromptText, state);
    });
    workflow.addNode('bitcoin', async (state: AgentState) => {
      const result = await getBitcoinPrice(state as AgentState);
      return { messages: [new AIMessage(result)] };
    });
    workflow.addNode('rag', async (state: AgentState) => {
      const func = await ragRetrieverFunc(VECTOR_STORE_PATH);
      const ragAnswer = await func(state);
      return { messages: [new AIMessage(ragAnswer)] };
    });

    // Определяем логику переходов для ReAct-цикла
    workflow.addEdge(START, 'bitcoin' as any);
    workflow.addEdge('bitcoin' as any, 'rag' as any);
    workflow.addEdge('rag' as any, 'agent' as any);
    workflow.addEdge('agent' as any, END);

    return workflow;
  };

  const graph = customGraph(model, tools, systemPrompt);

  const agent = new CustomAgent({
    model: model,
    systemPrompt: systemPrompt,
    tools: tools,
    graph,
  });

  console.log('Агент инициализирован.\n');

  // --- Примеры запросов ---
  const testQueries = [
    'Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag',
    'Удали кнопку забыли пароль',

    'Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению',
    'Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]',
    'Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем',
    'Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу',
  ];

  fs.mkdirSync('./chat_cache', { recursive: true });

  let fullContent: string[] = [];
  for (const query of testQueries) {
    console.log(`--- Запрос пользователя: "${query}" ---`);

    try {
      const result = await agent.invoke(query);

      const finalMessage = result.messages[result.messages.length - 1];
      console.log('Ответ агента:', finalMessage.content);
      fullContent = result.messages.map((it: any) => it.content) as string[];
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }

    console.log('---\n');
  }

  fs.writeFileSync('./chat_cache/example3.tsx', fullContent.join('\n'));

  console.log('--- Пример завершен ---');
}

// Запуск примера
runAgentExample().catch(console.error);
