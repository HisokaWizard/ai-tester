import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import * as fs from 'fs';
import {
  EMBEDDINGS_MODEL_NAME,
  VECTOR_STORE_PATH,
  XenovaEmbeddings,
} from '@/rag';
import { AIMessage } from '@langchain/core/messages';
import { NodeCallback } from './types';
import * as z from 'zod';

const DEFAULT_TOP_K = 4;

/**
 * Создает инструмент RAG, загружая VDB с диска.
 */
export async function createRagRetrieverTool(
  vectorStorePath: string = VECTOR_STORE_PATH
): Promise<DynamicStructuredTool> {
  try {
    const ragFunc = await ragRetrieverFunc(vectorStorePath);

    return new DynamicStructuredTool({
      name: 'rag_search',
      description:
        'Используй, когда нужна конкретная информация из документов. Введи запрос пользователя как есть.',
      func: async (input: string) => {
        return ragFunc({
          messages: [new AIMessage(input)],
        });
      },
      schema: z.string(),
    });
  } catch (error) {
    return new DynamicStructuredTool({
      name: 'rag_search',
      description: 'Поиск информации в базе знаний.',
      func: async () => `Ошибка загрузки RAG: ${(error as Error).message}`,
      schema: z.string(),
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

  const nodeFunc: NodeCallback = async (input: string): Promise<string> => {
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
