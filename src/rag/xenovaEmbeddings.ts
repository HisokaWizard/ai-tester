import { Embeddings } from '@langchain/core/embeddings';
import { pipeline } from '@xenova/transformers';

export class XenovaEmbeddings extends Embeddings {
  private pipe: any;
  private modelName: string;

  constructor(
    modelName = 'Xenova/all-MiniLM-L6-v2',
    params: Record<string, any> = {}
  ) {
    super(params);
    this.modelName = modelName;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    if (!this.pipe) {
      console.log(`Загрузка модели эмбеддинга: ${this.modelName}...`);
      this.pipe = await pipeline('feature-extraction', this.modelName);
    }

    const embeddings: number[][] = await Promise.all(
      texts.map(async (text) => {
        const result = await this.pipe(text, {
          pooling: 'mean', // Усредняем токены для получения одного вектора на документ
          normalize: true, // Нормализуем вектор
        });
        // result.data это Float32Array, преобразуем в обычный массив
        return Array.from(result.data);
      })
    );
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const embeddings = await this.embedDocuments([text]);
    return embeddings[0];
  }
}
