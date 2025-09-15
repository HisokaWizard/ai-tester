import { AgentState } from '@/agent-template/AgentTemplate';

export type NodeCallback = (state: AgentState) => Promise<string>;
