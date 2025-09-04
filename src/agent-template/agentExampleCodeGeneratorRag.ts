// main.ts
import { GigaChat } from 'langchain-gigachat';

import { CustomAgent } from './agent-template';
import { createRagRetrieverTool } from '../tools/ragRetrieverTool';
import fs from 'fs';

async function runAgentExample() {
  console.log('--- Запуск примера CustomAgent с RAG ---');

  // 1. Настройка модели GigaChat через официальный клиент
  const model = new GigaChat({
    model: 'GigaChat-2-Max',
    // temperature: 0,
    // accessToken: process.env.GIGA_CHAT_ACCESS_TOKEN,
    temperature: 0.1,
    credentials: process.env.GIGA_CHAT_ACCESS_TOKEN,
  });

  const tools = [await createRagRetrieverTool()];

  const systemPrompt = `
    Вы - виртуальный помощник компании. Ваша задача - отвечать на вопросы пользователей, используя предоставленные инструменты.

    ВСЕГДА следуйте этим правилам:
    1.  **ПЕРВЫМ ШАГОМ** для ЛЮБОГО запроса пользователя, который может касаться информации о компании, продуктах, услугах, политиках или стилях разработки, ВЫЗОВИТЕ инструмент \`rag_search\`. Передайте в него оригинальный запрос пользователя дословно.
    2.  ДОЖДИТЕСЬ результата от \`rag_search\`.
    3.  ИСПОЛЬЗУЙТЕ информацию, полученную из \`rag_search\`, чтобы сформулировать свой ответ.
    4.  Если \`rag_search\` не дал релевантной информации, честно сообщите об этом.
    5.  Отвечайте на русском языке.
    6.  Будьте вежливы и профессиональны.

    Пример взаимодействия:
    Пользователь: "Какие стили использовать для кнопок?"
    Вы: Вызываете rag_search("Какие стили использовать для кнопок?")
    rag_search возвращает: "Все компоненты должны использовать Tailwind CSS. Основной цвет для кнопок - синий (#3b82f6)."
    Вы: "Для стилизации кнопок следует использовать Tailwind CSS. Основной цвет - синий (#3b82f6)."
  `;

  const agent = new CustomAgent({
    model: model as any,
    systemPrompt: systemPrompt,
    tools: tools,
  });

  console.log('Агент инициализирован.\n');

  // --- Примеры запросов ---
  const testQueries = [
    'Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag',
    'Удали кнопку забыли пароль',
    'Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению',
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
