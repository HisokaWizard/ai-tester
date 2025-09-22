import { DynamicStructuredTool, tool } from '@langchain/core/tools';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import * as fs from 'fs';
import {
  EMBEDDINGS_MODEL_NAME,
  VECTOR_STORE_PATH,
  XenovaEmbeddings,
} from '@/rag';
import * as z from 'zod';

const DEFAULT_TOP_K = 4;

/**
 * Создает инструмент RAG, загружая VDB с диска.
 */
export async function createRagRetrieverTool(
  vectorStorePath: string = VECTOR_STORE_PATH
): Promise<DynamicStructuredTool> {
  const schema = z.object({
    path: z
      .string()
      .describe(
        'Absolute path to the file you want to read (e.g., /home/user/project/config.json). ' +
          "Must be a full path — relative paths like './file.txt' are not allowed. " +
          'Ensure the file exists before calling this tool.'
      ),
  });
  try {
    const ragFunc = await ragRetrieverFunc(vectorStorePath);

    return tool(
      (input) => {
        return ragFunc(input.path);
      },
      {
        name: 'rag_search',
        description:
          'Используй, когда нужна конкретная информация из документов. Введи запрос пользователя как есть.',
        schema,
      }
    );
  } catch (error) {
    return tool(() => `Ошибка загрузки RAG: ${(error as Error).message}`, {
      name: 'rag_search',
      description: 'Поиск информации в базе знаний.',
      schema,
    });
  }
}

export const ragRetrieverFunc = async (
  vectorStorePath: string = VECTOR_STORE_PATH
) => {
  if (!fs.existsSync(vectorStorePath)) {
    console.error(`❌ VDB не найдена по пути: ${vectorStorePath}`);
    throw Error(`❌ VDB не найдена по пути: ${vectorStorePath}`);
  }

  let vectorStore: HNSWLib | null = null;

  try {
    console.log(`📂 Загрузка VDB из ${vectorStorePath}...`);
    const embeddings = new XenovaEmbeddings(EMBEDDINGS_MODEL_NAME);
    vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
    console.log('✅ VDB успешно загружена.');
  } catch (error: any) {
    console.error('❌ Ошибка загрузки VDB:', (error as Error).message);
    throw Error(`❌ Ошибка загрузки VDB:' ${error.message}`);
  }

  const nodeFunc = async (input: string): Promise<string> => {
    if (!vectorStore) return 'Ошибка: VDB не доступна.';
    const THRESHOLD = 0.85;
    try {
      console.log(`\n🔍 [RAG] Поиск по запросу: "${input}"`);
      const results = await vectorStore.similaritySearchWithScore(
        input,
        DEFAULT_TOP_K
      );

      const relevantResults = results.filter(
        ([doc, score]) => score > THRESHOLD
      );

      if (relevantResults.length === 0) {
        console.log(`📭 [RAG] Ничего не найдено по запросу "${input}".`);
        return `${input}. 📭 [RAG] Ничего не найдено по запросу`;
      }

      console.log(`✅ [RAG] Найдено ${relevantResults.length} фрагментов.`);
      const contextParts = relevantResults.map(([doc, score], i) => {
        const source = doc.metadata?.source || 'Неизвестно';
        return `--- Фрагмент ${i + 1} (Источник: ${source}) ---\n${doc.pageContent}\n`;
      });
      return `${input}. Дополнение от Rag: ${contextParts.join('\n')}`;
    } catch (error) {
      console.error('[RAG] Ошибка поиска:', (error as Error).message);
      return `${input}. Ошибка поиска: ${(error as Error).message}`;
    }
  };

  return nodeFunc;
};
