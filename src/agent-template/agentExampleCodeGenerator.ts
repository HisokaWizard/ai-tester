// main.ts
import { ChatOpenAI } from '@langchain/openai';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';

// Импортируем наш кастомный класс агента
import { CustomAgent } from './agent-template'; // Убедитесь, что путь правильный
// Импортируем наш RAG-инструмент
import { createRagRetrieverTool } from '../tools/ragRetrieverTool'; // Убедитесь, что путь правильный
import fs from 'fs';

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

  const gigaChatUrl = 'https://gigachat.devices.sberbank.ru/api/v1';
  const gigaChatModel = 'GigaChat-2-Max';
  const gigaChatApiKey = process.env.GIGA_CHAT_ACCESS_TOKEN;

  const model2 = new ChatOpenAI({
    modelName: gigaChatModel,
    temperature: 0,
    configuration: {
      baseURL: gigaChatUrl,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      apiKey: gigaChatApiKey,
    },
  });

  // 2. Определение инструментов
  const tools = [await createRagRetrieverTool()]; // Добавляем наш RAG-инструмент

  // 3. Настройка промптов
  const systemPrompt = `
    Вы профессиональный програмист с актцентом на frontend.
    Ваша основная задача писать код по запросу пользователя и стилистику применять опираясь на
    предостваленный Rag используя соответствующий tools.
  `;

  // userPromptTemplate в базовом классе используется в упрощенном виде,
  // основная логика промпта для агента задается в методе callModel через ChatPromptTemplate.
  // Поэтому здесь мы можем оставить его пустым или стандартным.

  // 4. Создание экземпляра агента
  // Мы используем дефолтный граф, который создается внутри конструктора CustomAgent
  const agent = new CustomAgent({
    model: model,
    systemPrompt: systemPrompt,
    // userPromptTemplate: "{input}", // Можно не указывать, используется умолчание
    tools: tools,
    // graph: undefined, // Будет создан дефолтный граф
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

  fs.mkdirSync('./chat_cache/example.tsx', { recursive: true });

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

  /**
    let fullResponse = ''; // Для сборки полного ответа
     for await (const chunkAgent of agent.stream(testQueries)) {
    // chunk - это промежуточный результат от графа.
    // Его структура зависит от того, что возвращает compiledGraph.stream
    // Часто это объект состояния с новыми сообщениями или изменениями в состоянии.
    // console.log("Chunk received:", JSON.stringify(chunk, null, 2)); // Для отладки структуры chunk

    // --- Обработка chunk ---
    // Вам нужно извлечь текст из chunk.
    // Это зависит от структуры, которую возвращает ваш граф.
    // Пример (может потребоваться адаптация):
    const chunk = chunkAgent.agent;
    if (chunk && typeof chunk === 'object' && 'messages' in chunk) {
      const messages = chunk.messages;
      if (Array.isArray(messages) && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        // Проверяем, является ли сообщение от ИИ и содержит ли content
        if (lastMessage && lastMessage.constructor.name === 'AIMessageChunk') {
          // AIMessageChunk обычно имеет свойство content, которое может быть строкой или массивом токенов
          const content = lastMessage.content;
          if (typeof content === 'string') {
            // Если content - строка, выводим её
            process.stdout.write(content); // Выводим без новой строки, как печать на лету
            fullResponse += content;
          } else if (Array.isArray(content)) {
            // Если content - массив (например, токенов), нужно обработать его
            // Это зависит от конкретной реализации модели/библиотеки
            // content.forEach(token => process.stdout.write(token));
          }
        }
      }
    }
    // --- Конец обработки chunk ---

      console.log('\n\n--- Стриминг завершен ---');
  console.log('Полный ответ (собранный):', fullResponse);
  }
   */

  console.log('--- Пример завершен ---');
}

// Запуск примера
runAgentExample().catch(console.error);
