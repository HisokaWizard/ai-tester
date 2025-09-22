import { VECTOR_STORE_PATH } from '@/rag';
import { createRagRetrieverTool } from '../tools/ragRetrieverTool';

/**
 * Асинхронная функция для проверки работы RAG (Retrieval-Augmented Generation).
 * 
 * Функция выполняет следующие шаги:
 * 1. Создает инструмент для извлечения данных с помощью RAG, используя путь к векторному хранилищу.
 * 2. Выполняет поиск по запросу "Evm optimization Somnia".
 * 3. Выводит результаты поиска в консоль.
 * 
 * @remarks
 * Предполагается, что переменная окружения VECTOR_STORE_PATH и модуль ragRetrieverTool настроены правильно.
 * 
 * @example
 * ```typescript
 * // Функция запускается автоматически при выполнении файла.
 * ```
 */
(async () => {
  const ragTool = await createRagRetrieverTool(VECTOR_STORE_PATH);
  const result = await ragTool.invoke('Evm optimization Somnia');
  console.log('Результат поиска RAG:');
  console.log(result);
})();