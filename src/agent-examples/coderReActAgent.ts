import { readFile, saveFile, saveFiles } from '@/tools';
import { createRepo } from '@/tools/CreateRepoTool';
import { getLLM } from '@/utils/getLLM';
import { SimpleAgentLogger } from '@/utils/simpleLogger';
import { HumanMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
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

(async () => {
  const apiKey = process.env.OPEN_ROUTER_API_KEY ?? '';
  const baseURL = 'https://openrouter.ai/api/v1';
  const llm = getLLM({ baseURL, apiKey, modelName: 'x-ai/grok-4-fast:free' });

  const tools = [saveFile, readFile, saveFiles, createRepo];
  const logger = new SimpleAgentLogger();

  const agent = createReactAgent({
    llm,
    tools,
  }).withConfig({
    callbacks: [logger],
  });

  const template = PromptTemplate.fromTemplate(`
    Ты — непревзойденный разработчик frontend-приложений. Ты пишешь на React + TypeScript, используешь RTK Query для API. Используй кастомную функцию baseQuery и переиспользуй axios для запросов.

    ### Инструкции:
    1. Прочитай файл {analystDoc} с помощью тула "file_read".
    2. Прочитай файл {apisDoc} с помощью тула "file_read".
    3. Прочитай файл {designDocGlobal} с помощью тула "file_read".
    4. Прочитай файл {designDocStyles} с помощью тула "file_read".
    5. Прочитай файл {task} с помощью тула "file_read".
    6. Создай репозиторий фичи по пути {featurePath} с помощью тула "create_repo".
    7. Разработай бизнес-фичу, используя данные из прочитанных файлов.

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
  `);

  const message = (
    await template.invoke({
      analystDoc:
        '/Users/hisokawizard/Projects/ai-tester/src/sources/analystDoc.bpmn',
      designDocGlobal:
        '/Users/hisokawizard/Projects/ai-tester/src/sources/designDocGlobal.json',
      designDocStyles:
        '/Users/hisokawizard/Projects/ai-tester/src/sources/designDocStyles.css',
      apisDoc:
        '/Users/hisokawizard/Projects/ai-tester/src/sources/apisDoc.yaml',
      featurePath: '/Users/hisokawizard/Projects/ai-tester/codegenExample',
      task: '/Users/hisokawizard/Projects/ai-tester/src/sources/task.txt',
    })
  ).toString();

  try {
    const result = await agent.invoke({
      messages: [new HumanMessage(message)],
    });

    const agentResponseText = result.messages[result.messages.length - 1]
      .content as string;

    const validatedCode = validateAndParseCodeOutput(agentResponseText);

    console.log('✅ JSON успешно провалидирован');

    await saveFiles.invoke({
      files: [
        {
          path: '/Users/hisokawizard/Projects/ai-tester/codegenExample/Component.tsx',
          content: validatedCode.component,
        },
        {
          path: '/Users/hisokawizard/Projects/ai-tester/codegenExample/apis.ts',
          content: validatedCode.apis,
        },
        {
          path: '/Users/hisokawizard/Projects/ai-tester/codegenExample/styles.css',
          content: validatedCode.style,
        },
      ],
    });

    console.log('💾 Файлы успешно сохранены!');
  } catch (error) {
    console.error('🚨 Критическая ошибка:', error);
  }
})();
