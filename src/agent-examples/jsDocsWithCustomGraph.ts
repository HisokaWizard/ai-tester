import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { END, MemorySaver, START } from '@langchain/langgraph';
import { Annotation, StateGraph } from '@langchain/langgraph';
import { getAgentInput, getFilesByPath, getLLM } from '../utils/getLLM';
import { SimpleAgentLogger } from '@/utils/simpleLogger';
import { readFile } from '@/tools/FileReadTool';
import { saveFile } from '@/tools/FileWriteTool';

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  originalPath: Annotation<string | undefined>(),
  fileContent: Annotation<string | undefined>(),
  jsdocContent: Annotation<string | undefined>(),
});

type GraphStateType = typeof GraphState.State;

const tools = { readFile, saveFile };

async function readNode(state: GraphStateType) {
  const path = state.originalPath;

  if (!path) {
    return {
      messages: [new AIMessage('❌ Error: No file path provided.')],
    };
  }

  try {
    const content = await tools.readFile.invoke({ path });
    return {
      fileContent: content,
      messages: [new AIMessage(`✅ File read successfully from ${path}.`)],
    };
  } catch (error) {
    return {
      messages: [new AIMessage(`❌ Failed to read file: ${error}`)],
    };
  }
}

async function generateJSDocNode(
  state: GraphStateType,
  lang: string,
  llm: any
) {
  if (!state.fileContent) {
    return {
      messages: [new AIMessage('❌ Error: No file content to process.')],
    };
  }

  const prompt = `You are a senior TypeScript developer.
    TASK: Add comprehensive JSDoc comments to the following code (in "${lang}" language).
    - Preserve all original code structure exactly.
    - Only add JSDoc comments above functions, classes, and component definitions.
    - DO NOT add any explanations, notes, or greetings.
    - DO NOT wrap the output in Markdown, backticks, code fences, or any formatting.
    - Return ONLY the raw modified source code — nothing before, nothing after.
    IMPORTANT: If you output even a single backtick or markdown code block, you FAIL.
    Code:
    ${state.fileContent}`;

  try {
    const result = await llm.invoke([{ content: prompt, role: 'user' }]);
    const jsdocContent = result.content.trim();

    return {
      jsdocContent,
      messages: [new AIMessage('✅ JSDoc generated.')],
    };
  } catch (error) {
    return {
      messages: [new AIMessage(`❌ Failed to generate JSDoc: ${error}`)],
    };
  }
}

async function saveNode(state: GraphStateType) {
  const path = state.originalPath;
  const content = state.jsdocContent;

  if (!path || !content) {
    return {
      messages: [
        new AIMessage('❌ Error: Missing path or JSDoc content for saving.'),
      ],
    };
  }

  try {
    await tools.saveFile.invoke({ path, content });
    return {
      messages: [new AIMessage(`✅ JSDoc successfully saved to ${path}.`)],
    };
  } catch (error) {
    return {
      messages: [new AIMessage(`❌ Failed to save file: ${error}`)],
    };
  }
}

void (async () => {
  const apiKey = process.env.OPEN_ROUTER_API_KEY ?? '';
  const baseURL = 'https://openrouter.ai/api/v1';

  const llm = getLLM({ apiKey, modelName: 'x-ai/grok-4-fast:free', baseURL });

  // const { lang, pathTo } = await getAgentInput();
  const lang = 'russian';
  const pathTo =
    '/Users/hisokawizard/Projects/ai-tester/src/scripts/ragChecker.ts';

  const workflow = new StateGraph(GraphState)
    .addNode('read_file', readNode, {})
    .addNode('generate_jsdoc', (state) => generateJSDocNode(state, lang, llm))
    .addNode('save_file', saveNode)
    .addEdge(START, 'read_file')
    .addEdge('read_file', 'generate_jsdoc')
    .addEdge('generate_jsdoc', 'save_file')
    .addEdge('save_file', END);

  const checkpointer = new MemorySaver();

  const logger = new SimpleAgentLogger();

  const graph = workflow.compile({ checkpointer }).withConfig({
    callbacks: [logger],
  });

  const paths = getFilesByPath(pathTo);

  for (const p of paths) {
    await graph.invoke({ originalPath: p }, { configurable: { thread_id: p } });
  }
})();
