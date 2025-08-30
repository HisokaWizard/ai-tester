import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

const mode = process.env.NODE_ENV || 'development';

const env = loadEnv(mode, process.cwd(), '');

export default defineConfig({
  ssr: {
    noExternal: [],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.GIGA_CHAT_API_KEY': JSON.stringify(env.GIGA_CHAT_API_KEY),
    'process.env.RAG_WORKING_DIRECTORY': JSON.stringify(
      env.RAG_WORKING_DIRECTORY
    ),
    'process.env.RAG_SOURCE_DIRECTORY': JSON.stringify(
      env.RAG_SOURCE_DIRECTORY
    ),
    'process.env.OPEN_AI_API_KEY': JSON.stringify(env.OPEN_AI_API_KEY),
    'process.env.OPEN_ROUTER_API_KEY': JSON.stringify(env.OPEN_ROUTER_API_KEY),
  },
  build: {
    target: 'node22',
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.ts'),
        'rag/runRagIndexer': resolve(__dirname, 'src/rag/runRagIndexer.ts'),
        'tools/ragChecker': resolve(__dirname, 'src/tools/ragChecker.ts'),
        'agent/agentExampleCodeGenerator': resolve(
          __dirname,
          'src/agent-template/agentExampleCodeGenerator.ts'
        ),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name]-[hash].js`,
      },
      external: [
        // Все встроенные модули Node.js, которые вы используете
        'fs',
        'path',
        'node:fs',
        'node:path',
        // Ваши сторонние зависимости
        /^langchain(\/.*)?$/,
        /^@langchain\/.*/,
        /^@xenova\/.*/,
        'hnswlib',
        'fs-extra',
        'fast-glob',
        'glob',
        'zod',
        'dotenv',
      ],
    },
  },
});
