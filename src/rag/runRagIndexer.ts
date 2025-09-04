import {
  EMBEDDINGS_MODEL_NAME,
  indexDirectoryAndSave,
  VECTOR_STORE_PATH,
} from './ragIndexer';

const RAG_SOURCE_DIRECTORY = process.env.RAG_SOURCE_DIRECTORY ?? '../src';

(async () => {
  await indexDirectoryAndSave(
    RAG_SOURCE_DIRECTORY,
    ['.ts', '.tsx', '.md', '.js', 'jsx'],
    VECTOR_STORE_PATH,
    EMBEDDINGS_MODEL_NAME,
    2500,
    500
  );
})();
