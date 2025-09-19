import { tool } from '@langchain/core/tools';
import fs from 'fs';
import * as z from 'zod';

export const readFile = tool(
  (input) => {
    return fs.readFileSync(input.path, 'utf-8');
  },
  {
    name: 'file_read',
    description:
      'Use this tool to read the full text content of a file from the local filesystem. ' +
      'Only works with absolute paths. Ideal for loading configs, source code, logs, or user data. ' +
      ' Will fail if file does not exist or is not readable. Do NOT use for binary files (images, PDFs, etc).',
    schema: z.object({
      path: z
        .string()
        .describe(
          'Absolute path to the file you want to read (e.g., /home/user/project/config.json). ' +
            "Must be a full path — relative paths like './file.txt' are not allowed. " +
            'Ensure the file exists before calling this tool.'
        ),
    }),
  }
);
