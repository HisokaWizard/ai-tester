import { HumanMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { getAgentInput, getFilesByPath, getLLM } from '../utils/getLLM';
import { SimpleAgentLogger } from '@/utils/simpleLogger';
import { readFile } from '@/tools/FileReadTool';
import { saveFile } from '@/tools/FileWriteTool';

void (async () => {
  console.log("--- Запуск примера 'ИИ-агент докописец' ---");
  const { lang, pathTo } = await getAgentInput();
  const apiKey = process.env.OPEN_ROUTER_API_KEY ?? '';
  const baseURL = 'https://openrouter.ai/api/v1';

  const llm = getLLM({ apiKey, modelName: 'qwen/qwen3-coder', baseURL });
  const agentTools = [readFile, saveFile];
  const logger = new SimpleAgentLogger();

  const agent = createReactAgent({
    llm,
    tools: agentTools,
  }).withConfig({
    callbacks: [logger],
  });

  const template = PromptTemplate.fromTemplate(`
    You are a code documentation assistant.
    Your task:
    1. Read the file at "{path}" using the "file_read" tool.
    2. Generate comprehensive JSDoc comments in "{lang}" for all functions and classes in the file.
    3. Save the updated code with JSDoc BACK to the same file path using the "file_save" tool.
    4. DO NOT output the code in the chat — only confirm that the file was updated.
    `);

  const paths = getFilesByPath(pathTo);

  for (const p of paths) {
    const message = (
      await template.invoke({
        lang,
        path: p,
      })
    ).toString();

    await agent.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      { configurable: { thread_id: p } }
    );
  }
})();
