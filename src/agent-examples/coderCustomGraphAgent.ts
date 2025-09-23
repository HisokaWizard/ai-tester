import { readFile, saveFile } from '@/tools';
import { createRepo } from '@/tools/CreateRepoTool';
import { getLLM } from '@/utils/getLLM';
import { SimpleAgentLogger } from '@/utils/simpleLogger';
import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import * as z from 'zod';

const CodeOutputSchema = z.object({
  component: z.string(),
  apis: z.string(),
  style: z.string(),
});

function validateAndParseCodeOutput(rawText: string) {
  try {
    const parsed = JSON.parse(rawText);
    return CodeOutputSchema.parse(parsed);
  } catch (error) {
    console.error('❌ Ошибка валидации JSON от LLM:', error);
    throw new Error(
      'LLM вернул невалидный JSON-ответ. Требуется строгий формат { component, apis, style }'
    );
  }
}

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  analystPath: Annotation<string>(),
  apisPath: Annotation<string>(),
  designTokensPath: Annotation<string>(),
  designStylesPath: Annotation<string>(),
  taskDescriptionPath: Annotation<string>(),
  featurePath: Annotation<string>(),
  resultContent: Annotation<string>(),
  constructedContent: Annotation<string>(),
  resultComponentPath: Annotation<string>(),
  resultStylesPath: Annotation<string>(),
  resultApisPath: Annotation<string>(),
});

type GraphStateType = typeof GraphState.State;

const readDocsNode = async (state: GraphStateType) => {
  try {
    const analystContent = await readFile.invoke({ path: state.analystPath });
    const apisContent = await readFile.invoke({ path: state.apisPath });
    const designTokensContent = await readFile.invoke({
      path: state.designTokensPath,
    });
    const designStylesContent = await readFile.invoke({
      path: state.designStylesPath,
    });
    const taskDescriptionContent = await readFile.invoke({
      path: state.taskDescriptionPath,
    });

    const constructedContent = `
      // Task content
      ${taskDescriptionContent}
      // Analyst content
      ${analystContent}
      // Apis content
      ${apisContent}
      // Design tokens content
      ${designTokensContent}
      // Design styles content
      ${designStylesContent}
    `;

    return {
      ...state,
      constructedContent,
      messages: [new AIMessage(constructedContent)],
    };
  } catch (error) {
    return {
      ...state,
      messages: [new AIMessage(`❌ Ошибка при чтении файлов: ${error}`)],
    };
  }
};

const callAgent = async (state: GraphStateType, llm: ChatOpenAI) => {
  try {
    const content = `
        Ты — непревзойденный разработчик frontend-приложений. Ты пишешь на React + TypeScript, используешь RTK Query для API. Используй кастомную функцию baseQuery и переиспользуй axios для запросов.

        ### ЖЕСТКОЕ ТРЕБОВАНИЕ К ВЫХОДНОМУ ФОРМАТУ:
        Ты ДОЛЖЕН вернуть ТОЛЬКО ОДИН JSON-объект в следующем формате. НИЧЕГО, КРОМЕ ЭТОГО JSON. НИКАКИХ ПОЯСНЕНИЙ, КОММЕНТАРИЕВ, MARKDOWN, ОБРАТНЫХ КАВЫЧЕК, СЛОВ "ВОТ ТВОЙ КОД" — ТОЛЬКО ЧИСТЫЙ JSON.

        Формат ответа:
        {{
          "component": "строка с кодом React-компонентa (.tsx)",
          "apis": "строка с кодом RTK Query API (.ts)",
          "style": "строка с CSS-стилями"
        }}

        ### Пример (этот пример НЕ нужно повторять, он только для формата):
        {{
          "component": "import React from 'react';\\nexport const MyComponent = () => <div>Hello</div>;",
          "apis": "import {{ createApi }} from '@reduxjs/toolkit/query/react';\\nexport const api = createApi({{ ... }});",
          "style": ".my-component {{ color: red; }}"
        }}

        ### ВАЖНО:
        - НЕ оборачивай JSON в \`\`\`json ... \`\`\`.
        - НЕ добавляй текст до или после JSON.
        - НЕ изменяй имена полей: component, apis, style.
        - НЕ возвращай массив или что-то кроме объекта с тремя строковыми полями.
        - Если ты не можешь сгенерировать код — верни пустые строки, но СОХРАНИ СТРУКТУРУ.

        Теперь выполни задачу и верни ТОЛЬКО JSON.

        ### ПОЛНАЯ ЗАДАЧА С КОНТЕКСТОМ:
        ${state.constructedContent}
    `;
    const result = await llm.invoke([{ content, role: 'user' }]);

    return {
      ...state,
      resultContent: result.content,
      messages: [
        new AIMessage(
          '✅ Код успешно сгенерирован и передан в качестве переменной resultContent'
        ),
      ],
    };
  } catch (error) {
    return {
      ...state,
      messages: [new AIMessage(`❌ Ошибка запроса к LLM: ${error}`)],
    };
  }
};

const saveResults = async (state: GraphStateType) => {
  try {
    const data = state.resultContent;

    const validatedResult = validateAndParseCodeOutput(data);

    await createRepo.invoke({ path: state.featurePath });

    await saveFile.invoke({
      path: state.resultComponentPath,
      content: validatedResult.component,
    });
    await saveFile.invoke({
      path: state.resultApisPath,
      content: validatedResult.apis,
    });
    await saveFile.invoke({
      path: state.resultStylesPath,
      content: validatedResult.style,
    });

    return {
      ...state,
      messages: [new AIMessage(`✅ Файлы успешно записаны на диск`)],
    };
  } catch (error) {
    return {
      ...state,
      messages: [
        new AIMessage(`❌ Ошибка при записи файлов на диск: ${error}`),
      ],
    };
  }
};

(async () => {
  const apiKey = process.env.OPEN_ROUTER_API_KEY ?? '';
  const baseURL = 'https://openrouter.ai/api/v1';
  const llm = getLLM({ apiKey, baseURL, modelName: 'x-ai/grok-4-fast:free' });
  const logger = new SimpleAgentLogger();

  const workflow = new StateGraph(GraphState)
    .addNode('read_docs', readDocsNode)
    .addNode('agent', (state) => callAgent(state, llm))
    .addNode('save_results', saveResults)
    .addEdge(START, 'read_docs')
    .addEdge('read_docs', 'agent')
    .addEdge('agent', 'save_results')
    .addEdge('save_results', END);

  const graph = workflow.compile().withConfig({
    callbacks: [logger],
  });

  graph.invoke({
    analystPath:
      '/Users/hisokawizard/Projects/ai-tester/src/sources/analystDoc.bpmn',
    apisPath: '/Users/hisokawizard/Projects/ai-tester/src/sources/apisDoc.yaml',
    taskDescriptionPath:
      '/Users/hisokawizard/Projects/ai-tester/src/sources/task.txt',
    featurePath: '/Users/hisokawizard/Projects/ai-tester/codegenExample2',
    designStylesPath:
      '/Users/hisokawizard/Projects/ai-tester/src/sources/designDocStyles.css',
    designTokensPath:
      '/Users/hisokawizard/Projects/ai-tester/src/sources/designDocGlobal.json',
    resultComponentPath:
      '/Users/hisokawizard/Projects/ai-tester/codegenExample2/ClientCard.tsx',
    resultApisPath:
      '/Users/hisokawizard/Projects/ai-tester/codegenExample2/ClientCard.apis.ts',
    resultStylesPath:
      '/Users/hisokawizard/Projects/ai-tester/codegenExample2/ClientCard.styles.css',
  });
})();
