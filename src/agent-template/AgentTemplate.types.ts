import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import { StateGraph } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { VerboseAgentLogger } from '@/tools/logger';

// --- 1. Определение типа состояния агента ---
// Используем интерфейс для большей ясности
export interface AgentState {
  messages: BaseMessage[];
}

// --- 2. Интерфейс для опций агента (с опциональным графом) ---
export interface AgentOptions {
  model: BaseLanguageModel;
  tools: ToolInterface[];
  systemPrompt: string;
  /**
   * Опциональный, предварительно созданный граф LangGraph.
   * Если не предоставлен, будет создан стандартный ReAct-граф.
   */
  graph?: StateGraph<any>;
  logger: VerboseAgentLogger;
}

export interface CallModelProps {
  model: BaseLanguageModel;
  tools: ToolInterface[];
  systemPromptText: string;
  state: AgentState;
  logger: BaseCallbackHandler;
}
