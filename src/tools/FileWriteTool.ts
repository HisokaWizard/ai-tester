import { tool } from '@langchain/core/tools';
import fs from 'fs';
import * as z from 'zod';

export const saveFile = tool(
  (input) => {
    fs.writeFileSync(input.path, input.content, 'utf-8');
  },
  {
    name: 'file_save',
    description:
      'Use this tool to persistently save text content to a file on the local filesystem. ' +
      'Only use absolute paths. Ideal for saving logs, user data, configuration files, or generated code. ' +
      'Do NOT use for temporary data — only when you need the file to exist after the session ends.',
    schema: z.object({
      path: z
        .string()
        .describe(
          'Absolute file path where the content should be saved (e.g., /home/user/project/config.json). ' +
            "Must include full path and filename with extension. Do not use relative paths like './file.txt'."
        ),
      content: z
        .string()
        .describe(
          'The full text content to write into the file. This will overwrite any existing file at the given path. ' +
            'Ensure content is properly formatted (e.g., valid JSON, YAML, or plain text) before saving.'
        ),
    }),
  }
);
