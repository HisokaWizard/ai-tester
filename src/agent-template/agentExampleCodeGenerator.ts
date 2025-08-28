// main.ts
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

// Импортируем наш кастомный класс агента
import { CustomAgent } from './agent-template'; // Убедитесь, что путь правильный
// Импортируем наш RAG-инструмент
import { createRagRetrieverTool } from '../tools/ragRetrieverTool'; // Убедитесь, что путь правильный

async function runAgentExample() {
  console.log('--- Запуск примера CustomAgent с RAG ---');

  // 1. Настройка модели OpenAI
  // Убедитесь, что переменная окружения OPENAI_API_KEY установлена
  const model = new ChatOpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
    modelName: 'gpt-4o-mini', // Или "gpt-4-turbo", "gpt-3.5-turbo"
    temperature: 0, // Для более детерминированного поведения
  });

  // 2. Определение инструментов
  const tools = [await createRagRetrieverTool()]; // Добавляем наш RAG-инструмент

  // 3. Настройка промптов
  const systemPrompt = `
    Вы - виртуальный помощник компании. Ваша задача - отвечать на вопросы пользователей, используя предоставленные инструменты.
    
    Инструкции:
    1. Всегда сначала попробуйте найти информацию с помощью инструмента rag_search.
    2. Используйте найденную информацию, чтобы сформулировать полный и точный ответ.
    3. Если rag_search не дал релевантной информации, честно сообщите об этом.
    4. Отвечайте на русском языке.
    5. Будьте вежливы и профессиональны.
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
    'Какова миссия вашей компании?',
    'Расскажите о функциях вашего продукта.',
    'Когда работает ваша техподдержка?',
    'Сколько стоит ваш сервис?',
    'Какова ваша политика возврата?',
    'Как мне установить ваше программное обеспечение?', // Запрос, на который у нас нет информации
  ];

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
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }

    console.log('---\n');
  }

  console.log('--- Пример завершен ---');
}

// Запуск примера
runAgentExample().catch(console.error);
