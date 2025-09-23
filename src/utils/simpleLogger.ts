import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { Serialized } from '@langchain/core/load/serializable';
import { LLMResult } from '@langchain/core/outputs';
import { ChainValues } from '@langchain/core/utils/types';

const COLORS = {
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
};

const color = (text: string, colorCode: string) => {
  return `${colorCode}${text}${COLORS.reset}`;
};

export class SimpleAgentLogger extends BaseCallbackHandler {
  name = 'SimpleAgentLogger';
  private chainStartTime: Record<string, number> = {};
  private toolStartTime: Record<string, number> = {};
  private toolCounter = 0;

  constructor() {
    super();
    console.log(color('[LOGGER] SimpleAgentLogger initialized', COLORS.gray));
  }

  private log(event: string, details = '', colorCode = COLORS.gray) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(color(`[${timestamp}] ${event} ${details}`, colorCode));
  }

  private truncate(text: string, max = 150): string {
    if (!text) return '∅';
    return text.length > max ? `${text.slice(0, max)}...` : text;
  }

  // --- Chain ---

  handleChainStart(chain: Serialized, inputs: ChainValues, runId: string) {
    const chainType = chain.id?.[chain.id.length - 1] || 'unknown';
    this.chainStartTime[runId] = Date.now();
    const inputsString = Object.keys(inputs)
      .map(
        (k) =>
          `${k}: ${Array.isArray(inputs[k]) ? inputs[k].length : this.truncate(inputs[k], 15)}`
      )
      .join(';');
    this.log(
      `▶️ Chain start: ${chainType}`,
      `ID: ${runId}, state: {${inputsString}}`,
      COLORS.blue
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleChainEnd() {}

  handleChainError(err: any, runId: string) {
    const msg = err.message || String(err);
    this.log(
      `❌ Chain error`,
      `ID: ${runId} | ${this.truncate(msg)}`,
      COLORS.red
    );
  }

  // --- LLM ---
  handleLLMStart(llm: Serialized, prompts: string[], _runId: string) {
    this.log(
      `🧠 LLM start`,
      `Prompt: ${this.truncate(prompts[0])}`,
      COLORS.blue
    );
  }

  handleLLMEnd(output: LLMResult) {
    const contentResponse = output.generations?.[0]?.[0]?.text || '';
    const contentToolCallsResponse = (
      output.generations?.[0]?.[0] as any
    )?.message?.tool_calls
      ?.map((tool: any) => tool.name)
      .join(',');

    const response = contentResponse
      ? contentResponse
      : 'tool_calls: ' + contentToolCallsResponse;

    this.log(
      `✅ LLM end`,
      `Response: ${this.truncate(response)}`,
      COLORS.green
    );
  }

  handleLLMError(err: any, _runId: string) {
    const msg = err.message || String(err);
    this.log(`❌ LLM error`, this.truncate(msg), COLORS.red);
  }

  // --- Tool ---
  handleToolStart(tool: { name?: string }, input: string, runId: string) {
    this.toolCounter++;
    this.toolStartTime[runId] = Date.now();
    this.log(
      `🔧 Tool #${this.toolCounter} start: ${tool.name || 'unknown'}`,
      `Input: ${this.truncate(input)}`,
      COLORS.magenta
    );
  }

  handleToolEnd(output: string, runId: string) {
    const duration = Date.now() - this.toolStartTime[runId];
    delete this.toolStartTime[runId];
    this.log(
      `✅ Tool #${this.toolCounter} end`,
      `Output: ${this.truncate(output)} | ${duration}ms`,
      COLORS.green
    );
  }

  handleToolError(err: any, _runId: string) {
    const msg = err.message || String(err);
    this.log(
      `❌ Tool #${this.toolCounter} error`,
      this.truncate(msg),
      COLORS.red
    );
  }

  // --- Agent ---
  handleAgentAction() {
    this.log('⚙️ Agent action', '', COLORS.yellow);
  }

  handleAgentEnd() {
    this.log('🏁 Agent finished', '', COLORS.green);
  }
}
