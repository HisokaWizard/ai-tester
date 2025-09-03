import { DynamicTool } from '@langchain/core/tools';
import * as fs from 'fs';
import * as path from 'path';
import {
  EMBEDDINGS_MODEL_NAME,
  VECTOR_STORE_PATH,
  XenovaEmbeddings,
} from '@/rag';

const DEFAULT_TOP_K = 2;

// Простая структура для хранения документов с эмбеддингами
interface DocumentWithEmbedding {
  content: string;
  embedding: number[];
  source: string;
}

// Простое косинусное расстояние
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Создает простой RAG-инструмент без внешних зависимостей
 */
export async function createRagRetrieverTool(
  vectorStorePath: string = VECTOR_STORE_PATH
): Promise<DynamicTool> {
  if (!fs.existsSync(vectorStorePath)) {
    console.error(`❌ VDB не найдена по пути: ${vectorStorePath}`);
    return new DynamicTool({
      name: 'rag_search',
      description: 'Поиск информации в базе знаний.',
      func: async () => `Ошибка: VDB не найдена по пути ${vectorStorePath}.`,
    });
  }

  let documents: DocumentWithEmbedding[] = [];
  
  try {
    console.log(`📂 Загрузка VDB из ${vectorStorePath}...`);
    
    // Загружаем документы из docstore.json
    const docstorePath = path.join(vectorStorePath, 'docstore.json');
    const embeddingsPath = path.join(vectorStorePath, 'embeddings.json');
    
    if (fs.existsSync(docstorePath) && fs.existsSync(embeddingsPath)) {
      const docstoreContent = fs.readFileSync(docstorePath, 'utf-8');
      const embeddingsContent = fs.readFileSync(embeddingsPath, 'utf-8');
      
      const docstore = JSON.parse(docstoreContent);
      const allEmbeddings = JSON.parse(embeddingsContent);
      
      // Извлекаем содержимое документов
      const docs = Object.values(docstore).map((doc: any) => doc.pageContent);
      
      if (docs.length > 0 && allEmbeddings.length === docs.length) {
        console.log(`📄 Найдено ${docs.length} документов в VDB`);
        
        // Формируем структуру документов с эмбеддингами
        documents = docs.map((content, i) => ({
          content,
          embedding: allEmbeddings[i],
          source: `document_${i}`
        }));
        
        console.log('✅ VDB успешно загружена с эмбеддингами.');
      } else {
        console.warn('⚠️ VDB пуста или повреждена');
      }
    } else {
      console.error('❌ docstore.json или embeddings.json не найден в VDB');
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки VDB:', (error as Error).message);
    return new DynamicTool({
      name: 'rag_search',
      description: 'Поиск информации в базе знаний.',
      func: async () => `Ошибка загрузки RAG: ${(error as Error).message}`,
    });
  }

  return new DynamicTool({
    name: 'rag_search',
    description:
      'Используй, когда нужна конкретная информация из документов. Введи запрос пользователя как есть.',
    func: async (input: string) => {
      if (documents.length === 0) return 'Ошибка: VDB не доступна или пуста.';
      
      try {
        console.log(`\n🔍 [RAG] Поиск по запросу: "${input}"`);
        
        // Создаём эмбеддинг для запроса
        const embeddings = new XenovaEmbeddings(EMBEDDINGS_MODEL_NAME);
        const queryEmbedding = await embeddings.embedQuery(input);
        
        // Ищем наиболее похожие документы
        const similarities = documents.map(doc => ({
          document: doc,
          similarity: cosineSimilarity(queryEmbedding, doc.embedding)
        }));
        
        // Сортируем по сходству и берём топ-K
        const topResults = similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, DEFAULT_TOP_K)
          .filter(result => result.similarity > 0.1); // Минимальный порог сходства
        
        if (topResults.length === 0) {
          console.log(`📭 [RAG] Ничего не найдено по запросу "${input}".`);
          return 'Информация не найдена.';
        }
        
        console.log(`✅ [RAG] Найдено ${topResults.length} фрагментов.`);
        
        const contextParts = topResults.map((result, i) => {
          const source = result.document.source;
          const similarity = (result.similarity * 100).toFixed(1);
          return `--- Фрагмент ${i + 1} (Источник: ${source}, Сходство: ${similarity}%) ---\n${result.document.content}\n`;
        });
        
        return contextParts.join('\n');
      } catch (error) {
        console.error('[RAG] Ошибка поиска:', (error as Error).message);
        return `Ошибка поиска: ${(error as Error).message}`;
      }
    },
  });
}
