import { indexDirectoryAndSave, VECTOR_STORE_PATH } from './ragIndexer';

const RAG_SOURCE_DIRECTORY = process.env.RAG_SOURCE_DIRECTORY ?? '../src';

(async () => {
  await indexDirectoryAndSave(
    RAG_SOURCE_DIRECTORY,
    ['.ts', '.tsx', '.md', '.js', 'jsx'],
    VECTOR_STORE_PATH
  );
})();
