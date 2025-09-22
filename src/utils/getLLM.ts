import { globSync } from 'glob';
import inquirer from 'inquirer';
import { statSync } from 'node:fs';
import * as path from 'node:path';
import { ChatOpenAI } from '@langchain/openai';

export const getAgentInput = async () => {
  return await inquirer.prompt([
    {
      message: 'Укажите путь до папки (скрипта):',
      name: 'pathTo',
      type: 'input',
    },
    {
      message: 'Выберите язык документирования:  ',
      name: 'lang',
      choices: ['russian', 'english'],
      type: 'select',
    },
  ]);
};

export function getFilesByPath(rawPath: string): string[] {
  try {
    const resolvedPath = path.resolve(rawPath);
    const stat = statSync(resolvedPath);
    const toPosix = (p: string) => p.split(path.sep).join('/');

    if (stat.isFile()) {
      return [toPosix(resolvedPath)];
    }

    if (stat.isDirectory()) {
      const files = globSync('**/*.{js,jsx,ts,tsx}', {
        absolute: true,
        cwd: resolvedPath,
        ignore: [
          '**/node_modules/**',
          '**/node_modules',
          'node_modules/**',
          'node_modules',
        ],
        nodir: true,
        nocase: process.platform === 'win32',
        windowsPathsNoEscape: true,
      });

      return files.map(toPosix);
    }

    throw new Error(`Путь не является ни файлом, ни директорией: ${rawPath}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Ошибка при обработке пути "${rawPath}": ${error.message}`
      );
    }

    throw new Error(`Неизвестная ошибка при обработке пути "${rawPath}"`);
  }
}

interface LLMParams {
  baseURL: string;
  modelName: 'qwen/qwen3-coder';
  apiKey: string;
}

export const getLLM = ({ baseURL, modelName, apiKey }: LLMParams) => {
  return new ChatOpenAI({
    modelName,
    temperature: 0,
    configuration: {
      baseURL: baseURL.trim(),
      defaultHeaders: {
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:1993',
        'X-Title': 'AI-Testing',
      },
      apiKey,
    },
    timeout: 30_000,
  });
};
