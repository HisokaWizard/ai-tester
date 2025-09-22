import { tool } from '@langchain/core/tools';
import fs from 'fs';
import * as z from 'zod';

export const createRepo = tool(
  (input) => {
    return fs.mkdirSync(input.path, { recursive: true });
  },
  {
    name: 'create_repo',
    description: 'Use this tool create repo in the disk.',
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
