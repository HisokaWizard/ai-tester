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
    'process.env.GIGA_CHAT_ACCESS_TOKEN': JSON.stringify(
      env.GIGA_CHAT_ACCESS_TOKEN
    ),
    'process.env.COIN_MARKET_CUP_API_KEY': JSON.stringify(
      env.COIN_MARKET_CUP_API_KEY
    ),
    'process.env.GIGACHAT_CLIENT_ID': JSON.stringify(
      env.GIGACHAT_CLIENT_ID
    ),
    'process.env.GIGACHAT_CLIENT_SECRET': JSON.stringify(
      env.GIGACHAT_CLIENT_SECRET
    ),
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
        'utils/getGigaChatToken': resolve(__dirname, 'src/utils/getGigaChatToken.ts'),
        'agent/agentExampleCodeGenerator': resolve(
          __dirname,
          'src/agent-template/agentExampleCodeGenerator.ts'
        ),
        'agent/agentExampleCodeGeneratorRag': resolve(
          __dirname,
          'src/agent-template/agentExampleCodeGeneratorRag.ts'
        ),
        'agent/agentExampleCodeGeneratorCustomGraph': resolve(
          __dirname,
          'src/agent-template/agentExampleCodeGeneratorCustomGraph.ts'
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
        'events',
        'node:fs',
        'node:path',
        // Ваши сторонние зависимости
        /^langchain(\/.*)?$/,
        /^@langchain\/.*/,
        /^@xenova\/.*/,
        /^gigachat(\/.*)?$/,
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
