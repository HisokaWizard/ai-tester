import { AgentState } from '@/agent-template/agent-template';

export type NodeCallback = (state: AgentState) => Promise<string>;
