import { indexDirectoryAndSave, VECTOR_STORE_PATH } from './ragIndexer';
import * as path from 'path';

const RAG_SOURCE_DIRECTORY = path.resolve('./src');
// const RAG_SOURCE_DIRECTORY = process.env.RAG_SOURCE_DIRECTORY ?? path.resolve('./src');

(async () => {
  await indexDirectoryAndSave(
    RAG_SOURCE_DIRECTORY,
    ['.ts', '.tsx', '.md', '.js', 'jsx'],
    VECTOR_STORE_PATH
  );
})();
