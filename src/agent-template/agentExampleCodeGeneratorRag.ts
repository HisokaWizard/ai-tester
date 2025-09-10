// main.ts
import { ChatOpenAI } from '@langchain/openai';

import { CustomAgent } from './agent-template';
import { createRagRetrieverTool } from '../tools/ragRetrieverTool';
import fs from 'fs';
import { GigaChat } from 'langchain-gigachat';
import { GenericLLMWrapper } from './ModelWrapper';
import { BaseLanguageModel } from '@langchain/core/language_models/base';

async function runAgentExample() {
  console.log('--- Запуск примера CustomAgent с RAG ---');

  //? GigaChat langchain (нативная поддержка инструментов)
  const model = new GigaChat({
    model: 'GigaChat',
    temperature: 0.1,
    credentials: process.env.GIGA_CHAT_API_KEY,
    // accessToken: process.env.GIGA_CHAT_ACCESS_TOKEN,
  });

  //? Base model Gigachat (через GenericLLMWrapper)
  // const model = new GenericLLMWrapper({
  //   endpoint: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
  //   apiKey: process.env.GIGA_CHAT_ACCESS_TOKEN!,
  //   modelName: 'GigaChat',
  //   supportsTools: false //! ПРОПС КОТОРЫЙ НУЖНО ЗНАТЬ ЗАРАНЕЕ ПРИ ВЫБОРЕ МОДЕЛИ
  // });

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
    model: model as BaseLanguageModel,
    systemPrompt: systemPrompt,
    tools: tools,
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

      // Обрабатываем tool_calls если они есть
      if (finalMessage.tool_calls && finalMessage.tool_calls.length > 0) {
        console.log(`[INFO] Агент вызвал ${finalMessage.tool_calls.length} инструмент(ов):`);
        finalMessage.tool_calls.forEach((call: any, index: number) => {
          console.log(`  ${index + 1}. ${call.name}: ${call.args}`);
        });
      }

      console.log('Ответ агента:', finalMessage.content || 'Нет текстового ответа');
      fullContent = result.messages.map((it: any) => it.content).filter(Boolean);
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
