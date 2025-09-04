// main.ts
import { ChatOpenAI } from '@langchain/openai';

import {
  AgentState,
  callModel,
  CustomAgent,
  shouldContinue,
} from './agent-template';
import { createRagRetrieverTool } from '../tools/ragRetrieverTool';
import fs from 'fs';
import { END, START, StateGraph } from '@langchain/langgraph';
import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import { getBitcoinPrice } from '@/tools/getBitcoinPrice';

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

  const tools = [await createRagRetrieverTool()];

  const systemPrompt = `
    Вы профессиональный разработчик ПО, по профилю frontend + ai-agent.
    Вы созданы для того, чтобы писать лучший код в стеке frontend(react, typescript, rtkquery, ect.)
    Ваша задача выполнять все запросы пользователя и при необходимости обращаться к инструментам {tools}
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
    workflow.addNode('agent', (state: AgentState) =>
      callModel(model, tools, systemPromptText, state)
    );
    workflow.addNode('bitcoin', async (state: AgentState) => {
      const result = await getBitcoinPrice(state as AgentState);
      return { messages: [new AIMessage(result)] };
    });
    workflow.addNode('action', new ToolNode(tools));

    // Определяем логику переходов для ReAct-цикла
    workflow.addEdge(START, 'bitcoin' as any);
    workflow.addEdge('bitcoin' as any, 'agent' as any);
    workflow.addConditionalEdges('agent' as any, shouldContinue, {
      continue: 'action' as any,
      end: END,
    });
    workflow.addEdge('action' as any, 'bitcoin' as any); // Ключевая связь для замыкания цикла

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
    // 'Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]',
    // 'Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем',
    // 'Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу',
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

  fs.writeFileSync('./chat_cache/example2.tsx', fullContent.join('\n'));

  console.log('--- Пример завершен ---');
}

// Запуск примера
runAgentExample().catch(console.error);
