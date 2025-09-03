import { Document } from 'langchain/document';
import * as fs from 'fs';
import * as path from 'path';
import { XenovaEmbeddings } from './xenovaEmbeddings';
import * as fsExtra from 'fs-extra';

const EMBEDDINGS_MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const VECTOR_STORE_PATH = process.env.RAG_WORKING_DIRECTORY ?? './vdb';
// Папки, которые нужно игнорировать
const IGNORED_PATTERNS = [
  // Скрытые директории и файлы
  '**/node_modules/**',
  '**/.git/**',
  '**/.vscode/**',
  '**/.idea/**', // IntelliJ IDEA
  '**/.DS_Store/**', // macOS
  '**/Thumbs.db', // Windows

  // Директории сборки и зависимостей
  '**/dist/**',
  '**/build/**',
  '**/.next/**', // Next.js
  '**/out/**', // Next.js export
  '**/coverage/**', // Тесты
  '**/.nyc_output/**', // NYC coverage

  // Файлы среды и секретов
  '**/.env*', // .env, .env.local, .env.production и т.д.
  '**/.npmrc', // npm config
  '**/.yarnrc', // yarn config
  '**/yarn.lock',
  '**/package-lock.json',
  '**/pnpm-lock.yaml',

  // Логи и временные файлы
  '**/*.log',
  '**/tmp/**',
  '**/temp/**',

  // IDE и редакторы
  '**/*.swp', // Vim swap files
  '**/*.swo', // Vim swap files
  '**/*.swn', // Vim swap files
  '**/*.tmp', // Generic temp files
  '**/*.bak', // Backup files

  // Бинарные и нечитаемые файлы (по расширению)
  '**/*.jpg',
  '**/*.png',
  '**/*.gif',
  '**/*.webp',
  '**/*.glb',
  '**/*.jpeg',
  '**/*.svg',
];
// Расширения файлов по умолчанию
const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.txt'];

// --- Улучшенный TextSplitter ---
/**
 * Кастомный разделитель текста, который пытается избегать разрывов
 * внутри логических блоков кода, особенно импортов/экспортов.
 */
class CodeAwareTextSplitter {
  private chunkSize: number;
  private chunkOverlap: number;
  private readonly BLOCK_START_TOKENS = [
    /^\s*import\s/, // import statement
    /^\s*export\s/, // export statement
    /^\s*interface\s+\w/, // interface SomeInterface
    /^\s*type\s+\w/, // type SomeType = ...
    /^\s*enum\s+\w/, // enum SomeEnum
    /^\s*class\s+\w/, // class SomeClass
    /^\s*abstract\s+class\s+\w/, // abstract class SomeClass
  ];
  // Регулярные выражения для строк, которые не считаются "началом блока" для перекрытия
  private readonly NON_BLOCK_LINES = [
    /^\s*$/, // Пустая строка
    /^\s*\/\//, // Однострочный комментарий //
    /^\s*\/\*/, // Начало многострочного комментария /*
    /^\s*\*/, // Строка многострочного комментария *
    /^\s*\*\//, // Конец многострочного комментария */
  ];

  constructor(chunkSize: number = 1000, chunkOverlap: number = 200) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  async splitText(text: string): Promise<string[]> {
    const lines = text.split('\n');
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLength = line.length + 1; // +1 for newline character

      // Если добавление строки превысит размер чанка
      if (
        currentLength + lineLength > this.chunkSize &&
        currentChunk.length > 0
      ) {
        // Сохраняем текущий чанк
        chunks.push(currentChunk.join('\n'));

        // Определяем, с какой строки начать следующий чанк (с учетом перекрытия)
        let overlapStartIndex = Math.max(
          0,
          i - Math.floor(this.chunkOverlap / 50)
        ); // Примерный подсчет строк для перекрытия
        // Ищем начало логического блока назад, если возможно
        overlapStartIndex = this.findLogicalBlockStart(
          lines,
          overlapStartIndex,
          i
        );

        // Начинаем новый чанк с перекрытия
        currentChunk = lines.slice(overlapStartIndex, i);
        currentLength = currentChunk.reduce((sum, l) => sum + l.length + 1, 0);
      }

      // Добавляем строку в текущий чанк
      currentChunk.push(line);
      currentLength += lineLength;
    }

    // Не забываем про последний чанк
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
    }

    return chunks;
  }

  /**
   * Пытается найти начало логического блока (импорт, экспорт, interface, type, enum, class) назад от заданной позиции.
   * @param lines Массив всех строк документа.
   * @param startIndex Индекс, с которого предполагается начать перекрытие.
   * @param currentIndex Текущий индекс в итерации основного цикла.
   * @returns Новый индекс начала перекрытия.
   */
  private findLogicalBlockStart(
    lines: string[],
    startIndex: number,
    currentIndex: number
  ): number {
    // Идем назад от текущей позиции (не дальше startIndex)
    for (let i = currentIndex - 1; i >= startIndex; i--) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Пропускаем пустые строки и комментарии
      const isNonBlockLine = this.NON_BLOCK_LINES.some((regex) =>
        regex.test(trimmedLine)
      );
      if (isNonBlockLine) {
        continue;
      }

      // Проверяем, является ли строка началом интересующего нас блока
      const isBlockStart = this.BLOCK_START_TOKENS.some((regex) =>
        regex.test(trimmedLine)
      );
      if (isBlockStart) {
        // Если нашли начало блока, возвращаем его индекс.
        // Это сделает так, что новый чанк начнется с этого блока.
        return i;
      }
    }

    // Если не нашли подходящего начала блока, возвращаем исходный startIndex
    return startIndex;
  }

  /**
   * Разделяет массив документов.
   * @param documents Массив документов Langchain.
   * @returns Массив разделенных документов.
   */
  async splitDocuments(documents: Document[]): Promise<Document[]> {
    const splitDocs: Document[] = [];
    for (const doc of documents) {
      const chunks = await this.splitText(doc.pageContent);
      chunks.forEach((chunk, i) => {
        // Создаем новый документ для каждого чанка, сохраняя метаданные оригинала
        // Добавляем индекс чанка к метаданным
        splitDocs.push(
          new Document({
            pageContent: chunk,
            metadata: {
              ...doc.metadata,
              chunk_index: i,
            },
          })
        );
      });
    }
    return splitDocs;
  }
}

// --- Функции поиска и загрузки файлов ---
/**
 * Рекурсивно находит файлы, исключая указанные папки, используя fast-glob.
 */
async function findFiles(
  directoryPath: string,
  extensions: string[],
  ignoredPatterns: string[] = IGNORED_PATTERNS
): Promise<string[]> {
  try {
    const absoluteBaseDir = path.resolve(directoryPath);
    console.log(`🔍 Поиск файлов в (абсолютный путь): ${absoluteBaseDir}`);

    // Проверяем, что директория существует
    if (!fs.existsSync(absoluteBaseDir)) {
      console.error(`❌ Директория не существует: ${absoluteBaseDir}`);
      return [];
    }

    // Простой поиск через fs.readdirSync для отладки
    console.log('🔍 Простой поиск файлов...');
    const allFiles: string[] = [];

    function scanDirectory(dir: string, relativePath: string = '') {
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const relativeItemPath = path.join(relativePath, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            // Пропускаем только node_modules и dist
            if (item !== 'node_modules' && item !== 'dist') {
              scanDirectory(fullPath, relativeItemPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (extensions.includes(ext)) {
              allFiles.push(fullPath);
              console.log(`✅ Найден файл: ${relativeItemPath}`);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Ошибка сканирования ${dir}:`, (error as Error).message);
      }
    }

    scanDirectory(absoluteBaseDir);

    console.log(`📁 Найдено файлов: ${allFiles.length}`);
    return allFiles;
  } catch (error) {
    console.error(
      `❌ Ошибка поиска файлов в ${directoryPath}:`,
      (error as Error).message
    );
    return [];
  }
}

async function loadDocumentFromFile(
  filePath: string
): Promise<Document | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileExtension = path.extname(filePath).toLowerCase();
    return new Document({
      pageContent: content,
      metadata: { source: filePath, fileType: fileExtension },
    });
  } catch (error) {
    console.warn(
      `⚠️ Не удалось прочитать файл ${filePath}: ${(error as Error).message}`
    );
    return null;
  }
}

async function indexDirectoryAndSave(
  directoryPath: string,
  fileExtensions: string[] = DEFAULT_EXTENSIONS,
  vectorStorePath: string = VECTOR_STORE_PATH,
  embeddingsModelName: string = EMBEDDINGS_MODEL_NAME,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
) {
  if (!fs.existsSync(directoryPath)) {
    console.error(`❌ Директория ${directoryPath} не существует.`);
    return;
  }

  console.log(`\n--- 🚀 Начало индексации ---`);
  console.log(`📁 Директория данных: ${directoryPath}`);
  console.log(`💾 Путь сохранения VDB: ${vectorStorePath}`);
  console.log(`🤖 Модель эмбеддинга: ${embeddingsModelName}`);
  console.log(`📏 Размер чанка: ${chunkSize}, Перекрытие: ${chunkOverlap}`);

  // 1. Найти файлы
  const filePaths = await findFiles(directoryPath, fileExtensions);
  if (filePaths.length === 0) {
    console.log('⚠️ Файлы для индексации не найдены.');
    return;
  }
  console.log(`📄 Найдено файлов: ${filePaths.length}`);

  // 2. Загрузить документы
  const documents: Document[] = [];
  for (const filePath of filePaths) {
    const doc = await loadDocumentFromFile(filePath);
    if (doc) documents.push(doc);
  }
  if (documents.length === 0) {
    console.log('⚠️ Не удалось загрузить ни один документ.');
    return;
  }
  console.log(`📦 Загружено документов: ${documents.length}`);

  // 3. Разделить текст на фрагменты с учетом логики кода
  console.log('✂️ Разделение документов на чанки...');
  const codeAwareSplitter = new CodeAwareTextSplitter(chunkSize, chunkOverlap);
  const splitDocs = await codeAwareSplitter.splitDocuments(documents);
  console.log(`✅ Создано фрагментов: ${splitDocs.length}`);

  // 4. Создать эмбеддинги и VDB
  try {
    console.log(
      `🤖 Инициализация модели эмбеддинга: ${embeddingsModelName}...`
    );
    const embeddings = new XenovaEmbeddings(embeddingsModelName);

    console.log('🧠 Создание эмбеддингов для документов...');
    const allEmbeddings = await embeddings.embedDocuments(
      splitDocs.map(doc => doc.pageContent)
    );

    // 5. Сохраняем в простом формате
    console.log(`💾 Сохранение VDB в ${vectorStorePath}...`);
    await fsExtra.ensureDir(vectorStorePath);

    // Сохраняем документы
    const docstore: Record<string, { pageContent: string; metadata: any }> = {};
    splitDocs.forEach((doc, i) => {
      docstore[`doc_${i}`] = {
        pageContent: doc.pageContent,
        metadata: doc.metadata
      };
    });

    fs.writeFileSync(
      path.join(vectorStorePath, 'docstore.json'),
      JSON.stringify(docstore, null, 2)
    );

    // Сохраняем эмбеддинги
    fs.writeFileSync(
      path.join(vectorStorePath, 'embeddings.json'),
      JSON.stringify(allEmbeddings, null, 2)
    );

    // Сохраняем метаданные
    const metadata = {
      totalDocuments: splitDocs.length,
      embeddingsModel: embeddingsModelName,
      chunkSize,
      chunkOverlap,
      indexedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(vectorStorePath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('🎉 Индексация успешно завершена!\n');
  } catch (error) {
    console.error('❌ Ошибка индексации:', (error as Error).message);
    if (error instanceof Error) {
      console.error('Детали:', error.stack);
    }
  }
}

// Экспортируем необходимые элементы
export {
  indexDirectoryAndSave,
  VECTOR_STORE_PATH,
  EMBEDDINGS_MODEL_NAME,
  XenovaEmbeddings,
  CodeAwareTextSplitter,
};
