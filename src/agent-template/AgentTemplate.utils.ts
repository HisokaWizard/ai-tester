import { ToolInterface } from '@langchain/core/tools';
import { ToolCallingAdapter } from './ToolCallingAdapter';
import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { AgentState, CallModelProps } from './AgentTemplate.types';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { VerboseAgentLogger } from '@/tools/logger';

/**
 * Ищем путь встраивания инструментов для любой вариации модели
 */
export const ensureToolCalling = (model: any, tools: ToolInterface[]) => {
  console.log('[DEBUG] model caps:', {
    name: model?.constructor?.name,
    hasBindTools: typeof model?.bindTools === 'function',
    hasWithTools: typeof model?.withTools === 'function',
    hasWithFunctions: typeof model?.withFunctions === 'function',
    hasBind: typeof model?.bind === 'function',
  });

  // Универсально: сначала нативные пути (bindTools/withTools/withFunctions), иначе адаптер

  // Логируем только удачные применения, не намерения
  if (typeof model?.bindTools === 'function') {
    try {
      const m = model.bindTools(tools, { tool_choice: 'auto' });
      console.log('[INFO] bindTools применён.');
      return m;
    } catch (e: any) {
      console.warn(
        '[WARN] bindTools не сработал, пробую другие варианты:',
        e?.message ?? e
      );
    }
  }

  if (typeof model?.withTools === 'function') {
    try {
      const m = model.withTools(tools);
      console.log('[INFO] withTools применён.');
      return m;
    } catch (e: any) {
      console.warn('[WARN] withTools не сработал, продолжаю:', e?.message ?? e);
    }
  }

  if (typeof model?.withFunctions === 'function') {
    try {
      const m = model.withFunctions(tools);
      console.log('[INFO] withFunctions применён.');
      return m;
    } catch (e: any) {
      console.warn(
        '[WARN] withFunctions не сработал, продолжаю:',
        e?.message ?? e
      );
    }
  }

  if (typeof model?.bind === 'function') {
    try {
      const m = model.bind({ tools, tool_choice: 'auto' });
      console.log('[INFO] bind применён.');
      return m;
    } catch (e: any) {
      console.warn('[WARN] bind не сработал, продолжаю:', e?.message ?? e);
    }
  }

  console.log(
    '[WARN] Не удалось привязать инструменты: вызываю ToolCallingAdapter.'
  );

  const adapted = new ToolCallingAdapter(model as any).bindTools(tools, {
    tool_choice: 'auto',
  });
  return (input: { messages: BaseMessage[] } | BaseMessage[]) =>
    adapted.invoke(input);
};

/**
 * Стандартный метод для обращения к LLM
 */
export const callModel = async ({
  model,
  tools,
  systemPromptText,
  state,
  logger,
}: CallModelProps): Promise<Partial<AgentState>> => {
  console.log('\n--- [DEBUG] Вызов узла "agent" ---');

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPromptText),
    new MessagesPlaceholder('messages'),
  ]);

  const modelWithTools = ensureToolCalling(model as any, tools);

  const chain = prompt.pipe(modelWithTools as BaseLanguageModel).withConfig({
    callbacks: [logger],
    runName: logger.name,
  });

  try {
    const response = (await chain.invoke({
      messages: state.messages,
    })) as AIMessage;

    console.log('[DEBUG] Ответ модели:', response);
    if (!response?.tool_calls || response.tool_calls.length === 0) {
      console.log(
        '[INFO] Модель не запросила инструмент (tool_calls пусты). Возможно, нужен адаптер/усиление промпта или другой провайдер.'
      );
    }
    if (response?.tool_calls?.length) {
      console.log(
        '[DEBUG] Обнаружены tool_calls:',
        (response as any).tool_calls
      );
    }

    return { messages: [response] };
  } catch (error: any) {
    console.error('[ERROR] Ошибка в callModel:', error);
    return {
      messages: [
        new AIMessage(
          `Произошла ошибка при обращении к модели: ${error.message}`
        ),
      ],
    };
  }
};

export const wrapToolsForLogger = (
  tools: ToolInterface[],
  logger: VerboseAgentLogger
) => {
  const wrappedTools = tools.map((tool) => {
    const originalFunc = tool.invoke;

    tool.invoke = async (input: string) => {
      const runId = `tool_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      try {
        if (logger.handleToolStart) {
          logger.handleToolStart({ name: tool.name }, input, runId, undefined);
        }

        const result = await originalFunc.call(tool, input);

        if (logger.handleToolEnd) {
          logger.handleToolEnd(result, runId);
        }

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        if (logger.handleToolError) {
          logger.handleToolError(err, runId);
        }

        throw err;
      }
    };

    return tool;
  });

  return wrappedTools;
};
