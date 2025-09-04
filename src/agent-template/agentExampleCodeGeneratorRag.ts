// main.ts
import { ChatOpenAI } from '@langchain/openai';

import { CustomAgent } from './agent-template';
import { createRagRetrieverTool } from '../tools/ragRetrieverTool';
import fs from 'fs';

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
    Вы - виртуальный помощник компании. Ваша задача - отвечать на вопросы пользователей, используя предоставленные инструменты.

    ВСЕГДА следуйте этим правилам:
    1.  **ПЕРВЫМ ШАГОМ** для ЛЮБОГО запроса пользователя, ВЫЗОВИТЕ инструмент \`rag_search\`. Передайте в него оригинальный запрос пользователя дословно.
    2.  ДОЖДИТЕСЬ результата от \`rag_search\`.
    3.  ИСПОЛЬЗУЙТЕ информацию, полученную из \`rag_search\`, чтобы сформулировать свой ответ.
    4.  Если \`rag_search\` не дал релевантной информации, для работы с llm необходимо использовать оригинальный запрос пользователя.
    5. Оригинальный запрос пользователя обязан быть доставлен до llm в любом случае. С помощью раг он может быть лишь дополнен.
    5.  Отвечайте на русском языке.
    6.  Будьте вежливы и профессиональны.
  `;

  const agent = new CustomAgent({
    model: model,
    systemPrompt: systemPrompt,
    tools: tools,
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
