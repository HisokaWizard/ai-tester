// main.ts
import { ChatOpenAI } from '@langchain/openai';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { GigaChat } from 'langchain-gigachat';

// Импортируем наш кастомный класс агента
import { CustomAgent } from './agent-template'; // Убедитесь, что путь правильный
// Импортируем наш RAG-инструмент
import { createRagRetrieverTool } from '../tools/ragRetrieverTool'; // Убедитесь, что путь правильный
import fs from 'fs';
import { BaseLanguageModel } from '@langchain/core/language_models/base';

async function runAgentExample() {
  console.log('--- Запуск примера CustomAgent с RAG ---');

  // 1. Настройка модели OpenAI
  // Убедитесь, что переменная окружения OPENAI_API_KEY установлена
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

  const gigaChatModel = 'GigaChat-2-Max';
  const gigaChatApiKey = process.env.GIGA_CHAT_API_KEY;
  const gigaChatAccessToken = process.env.GIGA_CHAT_ACCESS_TOKEN;

  const model2 = new GigaChat({
    model: gigaChatModel,
    temperature: 0,
    credentials: gigaChatApiKey,
    accessToken: gigaChatAccessToken,
  });

  // 2. Определение инструментов
  const tools = [await createRagRetrieverTool()]; // Добавляем наш RAG-инструмент

  // 3. Настройка промптов
  const systemPrompt = `
    Вы профессиональный програмист с актцентом на frontend.
    Ваша основная задача писать код по запросу пользователя и стилистику применять опираясь на
    предостваленный Rag используя соответствующий tools.
  `;

  // 4. Создание экземпляра агента
  // Мы используем дефолтный граф, который создается внутри конструктора CustomAgent
  const agent = new CustomAgent({
    model: model2 as BaseLanguageModel,
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
  // 5. Выполнение запросов
  for (const query of testQueries) {
    console.log(`--- Запрос пользователя: "${query}" ---`);

    try {
      // Запуск агента с пользовательским запросом
      const result = await agent.invoke(query);

      // Вывод результата
      // result - это финальное состояние агента
      const finalMessage = result.messages[result.messages.length - 1];
      console.log('Ответ агента:', finalMessage.content);
      fullContent = result.messages.map((it: any) => it.content) as string[];
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }

    console.log('---\n');
  }

  fs.writeFileSync('./chat_cache/example1.tsx', fullContent.join('\n'));

  console.log('--- Пример завершен ---');
}

// Запуск примера
runAgentExample().catch(console.error);
