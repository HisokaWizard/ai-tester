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
};
/**
 * Расширенный логгер для отслеживания работы агента
 * Реализует BaseCallbackHandler и обеспечивает детальную логировку всех этапов выполнения
 */
export class VerboseAgentLogger extends BaseCallbackHandler {
  /**
   * Имя обработчика
   */
  name = 'VerboseAgentLogger';

  /**
   * Хранилище типов цепочек по ID
   */
  private chainTypes: Record<string, string> = {};

  /**
   * Хранилище целей цепочек по ID
   */
  private chainPurposes: Record<string, string> = {};

  /**
   * Счётчик шагов по ID цепочки
   */
  private stepCounter: Record<string, number> = {};

  /**
   * Текущий активный ID выполнения
   */
  private currentRunId = '';

  /**
   * Время начала выполнения цепочек
   */
  private chainStartTime: Record<string, number> = {};

  /**
   * Отслеживание вызовов инструментов
   */
  private toolTracking: Map<
    string,
    {
      callNumber: number;
      input: string;
      name: string;
      parentRunId?: string;
      startTime: number;
    }
  > = new Map();

  /**
   * Общий счётчик вызовов инструментов
   */
  private toolCounter = 0;

  /**
   * Уже обработанные вызовы инструментов
   */
  private handledToolRuns: Set<string> = new Set();

  /**
   * Конструктор
   * Выводит начальное сообщение об инициализации логгера
   */
  constructor() {
    super();
    console.log(
      this.formatSection('🚀 Agent Logger initialized', '', '', COLORS.red)
    );
  }

  /**
   * Форматирование раздела с заголовком, эмодзи и содержимым
   * @param title - заголовок раздела
   * @param emoji - символ эмодзи
   * @param content - содержимое раздела
   * @param color - цветовой код ANSI
   * @returns Строка с отформатированным разделом
   */
  private formatSection(
    title: string,
    emoji: string,
    content: string,
    color: string
  ) {
    const separator = `${color}${'═'.repeat(70)}${COLORS.reset}`;
    const timestamp = new Date().toLocaleTimeString();

    if (!content) {
      return `${separator}\n${color}${emoji} ${title} [${timestamp}]${COLORS.reset}\n${separator}`;
    }

    const sectionHeader = `${color}${emoji} ${title} [${timestamp}]${COLORS.reset}`;
    return `${separator}\n${sectionHeader}\n\n${content}\n${separator}`;
  }

  /**
   * Форматирование пары ключ-значение с цветовым выделением
   * @param key - ключ
   * @param value - значение
   * @param emoji - эмодзи
   * @returns Отформатированная строка
   */
  private formatKeyValue(key: string, value: any, emoji = '•') {
    let formattedValue = value;
    if (key === 'Tool') {
      formattedValue = `${COLORS.blue}${COLORS.bold}${value}${COLORS.reset}`;
    } else if (key === 'Input') {
      formattedValue = `${COLORS.yellow}${value}${COLORS.reset}`;
    } else if (key === 'Output') {
      formattedValue = `${COLORS.magenta}${value}${COLORS.reset}`;
    }
    return `${emoji} ${key.padEnd(1, ' ')}: ${formattedValue}`;
  }

  private truncate(text: string, max = 500, truncate = true): string {
    if (!text) return 'Empty content';
    return truncate && text.length > max ? `${text.slice(0, max)}...` : text;
  }

  /**
   * Очистка данных после завершения выполнения
   * @param runId - ID выполнения
   */
  private cleanupRun(runId: string) {
    delete this.chainTypes[runId];
    delete this.chainPurposes[runId];
    delete this.stepCounter[runId];
    delete this.chainStartTime[runId];
    for (const [toolRunId, info] of this.toolTracking.entries()) {
      if (info.parentRunId === runId) {
        this.toolTracking.delete(toolRunId);
        this.handledToolRuns.delete(toolRunId);
      }
    }
    if (runId === this.currentRunId) this.currentRunId = '';
  }

  /**
   * Обработчик начала выполнения цепочки
   * @param chain - сериализованная цепочка
   * @param inputs - входные значения
   * @param runId - ID выполнения
   * @param parentRunId - ID родительского выполнения
   * @param tags - теги
   * @param metadata - метаданные
   */
  handleChainStart(
    chain: Serialized,
    inputs: ChainValues,
    runId: string,
    parentRunId?: string,
    tags?: string[],
    metadata?: Record<string, unknown>
  ) {
    const chainType = chain.id?.[chain.id.length - 1] || 'unknown';
    const chainPurpose = metadata?.purpose || 'General purpose';
    this.chainTypes[runId] = chainType;
    this.chainPurposes[runId] = chainPurpose as any;
    this.stepCounter[runId] = 0;
    this.currentRunId = runId;
    this.chainStartTime[runId] = Date.now();

    if (chainType === 'RunnableSequence') {
      const title = `🔗 CHAIN STARTED 🆔 Run ID: ${runId}`;
      console.log(this.formatSection(title, '', '', COLORS.cyan));
    }
  }

  /**
   * Обработчик завершения выполнения цепочки
   * @param outputs - выходные значения
   * @param runId - ID выполнения
   */
  handleChainEnd(outputs: ChainValues, runId: string) {
    if (this.chainTypes[runId] === 'RunnableSequence') {
      const duration = Date.now() - this.chainStartTime[runId];
      const chainType = this.chainTypes[runId];
      const content = [
        this.formatKeyValue('Chain Type', chainType, '🔗'),
        this.formatKeyValue('Duration', `${duration}ms`, '⏱️'),
        this.formatKeyValue('Tools Used', this.toolCounter, '🛠️'),
      ].join('\n');

      console.log(
        this.formatSection('🔗 CHAIN COMPLETED ✅', '', content, COLORS.cyan)
      );

      this.cleanupRun(runId);
    }
  }

  /**
   * Обработчик начала работы LLM
   * @param llm - сериализованный LLM
   * @param prompts - список промптов
   * @param runId - ID выполнения
   */
  handleLLMStart(llm: Serialized, prompts: string[], runId: string) {
    this.stepCounter[runId]!++;
    console.log(this.formatSection('🧠 LLM START', '', '', COLORS.blue));
  }

  /**
   * Обработчик завершения работы LLM
   * @param output - результат выполнения
   */
  handleLLMEnd(output: LLMResult) {
    const response = output.generations?.[0]?.[0]?.text || 'No response';
    const content = [
      this.formatKeyValue('Response', this.truncate(response), '💡'),
    ].join('\n');

    console.log(
      this.formatSection('🧠 LLM COMPLETED ✅', '', content, COLORS.blue)
    );
  }

  /**
   * Обработчик начала работы инструмента
   * @param tool - информация об инструменте
   * @param input - входные данные
   * @param runId - ID выполнения
   * @param parentRunId - ID родительского выполнения
   */
  handleToolStart(
    tool: { name?: string },
    input: string,
    runId: string,
    parentRunId?: string
  ) {
    this.toolCounter++;
    const toolName = tool.name || 'unknown';
    this.toolTracking.set(runId, {
      callNumber: this.toolCounter,
      input,
      name: toolName,
      parentRunId: parentRunId || this.currentRunId || 'None',
      startTime: Date.now(),
    });

    const content = [
      this.formatKeyValue('Call #', this.toolCounter, '#️⃣'),
      this.formatKeyValue('Run ID', runId, '🆔'),
      this.formatKeyValue(
        'Parent Run',
        parentRunId || this.currentRunId || 'None',
        '👨'
      ),
      this.formatKeyValue('Tool', toolName, '🔧'),
      this.formatKeyValue('Input', this.truncate(input, 500, false), '📥'),
    ].join('\n');

    console.log(
      this.formatSection(
        `⚡ TOOL START [${toolName} #${this.toolCounter}]`,
        '',
        content,
        COLORS.magenta
      )
    );
  }

  /**
   * Обработчик завершения работы инструмента
   * @param output - результат выполнения
   * @param runId - ID выполнения
   */
  handleToolEnd(output: string, runId: string) {
    if (this.handledToolRuns.has(runId)) {
      console.error(
        `${COLORS.red}⚠️ Duplicate TOOL END for runId: ${runId}${COLORS.reset}`
      );
      return;
    }
    this.handledToolRuns.add(runId);

    const toolInfo = this.toolTracking.get(runId);
    if (!toolInfo) {
      const content = [
        this.formatKeyValue('Run ID', runId, '🆔'),
        this.formatKeyValue('Status', 'Unknown tool - no start info', '⚠️'),
      ].join('\n');
      console.log(
        this.formatSection('❓ UNKNOWN TOOL COMPLETED', '', content, COLORS.red)
      );
      return;
    }

    const duration = Date.now() - toolInfo.startTime;
    const content = [
      this.formatKeyValue('Call #', toolInfo.callNumber, '#️⃣'),
      this.formatKeyValue('Run ID', runId, '🆔'),
      this.formatKeyValue('Tool', toolInfo.name, '🔧'),
      this.formatKeyValue('Duration', `${duration}ms`, '⏱️'),
      this.formatKeyValue('Parent Run', toolInfo.parentRunId, '👨'),
      this.formatKeyValue(
        'Input',
        this.truncate(toolInfo.input, 500, false),
        '📥'
      ),
      this.formatKeyValue(
        'Output',
        this.truncate(output, 500, false) || 'Empty content',
        '📤'
      ),
    ].join('\n');

    console.log(
      this.formatSection(
        `⚡ TOOL COMPLETED ✅ [${toolInfo.name} #${toolInfo.callNumber}]`,
        '',
        content,
        COLORS.magenta
      )
    );
    this.toolTracking.delete(runId);
  }

  /**
   * Обработчик ошибок цепочки
   * @param err - информация об ошибке
   * @param runId - ID выполнения
   */
  handleChainError(err: any, runId: string) {
    if (this.chainTypes[runId] === 'RunnableSequence') {
      const errorMsg = err.message || err.toString();
      const stack = err.stack || 'No stack trace';
      const content = [
        this.formatKeyValue('Error', errorMsg, '❌'),
        this.formatKeyValue('Stack', this.truncate(stack, 500, false), '📚'),
        this.formatKeyValue('Run ID', runId, '🆔'),
      ].join('\n');

      console.log(
        this.formatSection('🔥 CHAIN ERROR', '', content, COLORS.red)
      );
      console.log(
        `${COLORS.red}${''.repeat(
          30
        )}\n     🔥 AGENT WORK FAILED 🔥\n${''.repeat(30)}${COLORS.reset}`
      );
      this.cleanupRun(runId);
    }
  }

  /**
   * Обработчик ошибок LLM
   * @param err - информация об ошибке
   * @param runId - ID выполнения
   */
  handleLLMError(err: any, runId: string) {
    const errorMsg = err.message || err.toString();
    const stack = err.stack || 'No stack trace';
    const content = [
      this.formatKeyValue('Error', errorMsg, '❌'),
      this.formatKeyValue('Stack', this.truncate(stack, 500, false), '📚'),
      this.formatKeyValue('Run ID', runId, '🆔'),
    ].join('\n');

    console.log(this.formatSection('🔥 LLM ERROR', '', content, COLORS.red));
  }

  /**
   * Обработчик ошибок инструмента
   * @param err - информация об ошибке
   * @param runId - ID выполнения
   */
  handleToolError(err: any, runId: string) {
    if (this.handledToolRuns.has(runId)) {
      console.error(
        `${COLORS.red}⚠️ Duplicate TOOL ERROR for runId: ${runId}${COLORS.reset}`
      );
      return;
    }
    this.handledToolRuns.add(runId);

    const toolInfo = this.toolTracking.get(runId);
    const errorMsg = err.message || err.toString();
    const stack = err.stack || 'No stack trace';

    if (toolInfo) {
      const duration = Date.now() - toolInfo.startTime;
      const content = [
        this.formatKeyValue('Call #', toolInfo.callNumber, '#️⃣'),
        this.formatKeyValue('Tool', toolInfo.name, '🔧'),
        this.formatKeyValue('Run ID', runId, '🆔'),
        this.formatKeyValue('Duration', `${duration}ms`, '⏱️'),
        this.formatKeyValue('Parent Run', toolInfo.parentRunId, '👨'),
        this.formatKeyValue(
          'Input',
          this.truncate(toolInfo.input, 500, false),
          '📥'
        ),
        this.formatKeyValue('Error', errorMsg, '❌'),
        this.formatKeyValue('Stack', this.truncate(stack, 500, false), '📚'),
      ].join('\n');

      console.log(
        this.formatSection(
          `💥 TOOL ERROR [${toolInfo.name} #${toolInfo.callNumber}]`,
          '',
          content,
          COLORS.red
        )
      );
      this.toolTracking.delete(runId);
    } else {
      const content = [
        this.formatKeyValue('Run ID', runId, '🆔'),
        this.formatKeyValue('Error', errorMsg, '❌'),
        this.formatKeyValue('Stack', this.truncate(stack, 500, false), '📚'),
        this.formatKeyValue('Status', 'Unknown tool - no start info', '⚠️'),
      ].join('\n');

      console.log(this.formatSection('💥 TOOL ERROR', '', content, COLORS.red));
    }
  }

  /**
   * Обработчик действия агента
   */
  handleAgentAction(): Promise<void> | void {
    console.log(
      this.formatSection('⚙️ AGENT ACTION', '', '', COLORS.brightBlack)
    );
  }

  /**
   * Обработчик завершения работы агента
   */
  handleAgentEnd(): Promise<void> | void {
    console.log(this.formatSection('🏁 AGENT FINISH WORK', '', '', COLORS.red));
  }
}
