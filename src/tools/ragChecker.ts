// useRag.ts
import { VECTOR_STORE_PATH } from '@/rag';
import { createRagRetrieverTool } from './ragRetrieverTool';

(async () => {
  const ragTool = await createRagRetrieverTool(VECTOR_STORE_PATH);
  const result = await ragTool.invoke('Evm optimization Somnia');
  console.log('Результат поиска RAG:');
  console.log(result);
})();
