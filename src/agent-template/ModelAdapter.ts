// ModelAdapter.ts
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ToolInterface } from '@langchain/core/tools';
import { ToolCallingAdapter, BaseInvokeModel } from './ToolCallingAdapter';

/**
 * Универсальный адаптер для моделей с поддержкой tool calling
 * Работает как с нативными LangChain моделями, так и с кастомными обертками
 */
export class ModelAdapter {
   private model: BaseLanguageModel | BaseInvokeModel;
   private tools: ToolInterface[] = [];

   constructor(model: BaseLanguageModel | BaseInvokeModel) {
      this.model = model;
   }

   /**
    * Привязывает инструменты к модели
    */
   bindTools(tools: ToolInterface[], options: { tool_choice?: 'auto' | 'required' } = {}) {
      this.tools = tools;

      // Если модель уже поддерживает bindTools (LangChain модели)
      if (this.isLangChainModel(this.model) && typeof (this.model as any).bindTools === 'function') {
         return (this.model as any).bindTools(tools, options);
      }

      // Если модель поддерживает другие методы привязки инструментов
      if (this.isLangChainModel(this.model)) {
         if (typeof (this.model as any).withTools === 'function') {
            return (this.model as any).withTools(tools);
         }
         if (typeof (this.model as any).withFunctions === 'function') {
            return (this.model as any).withFunctions(tools);
         }
         if (typeof (this.model as any).bind === 'function') {
            return (this.model as any).bind({ tools, tool_choice: options.tool_choice });
         }
      }

      // Для кастомных моделей используем ToolCallingAdapter
      if (this.isCustomModel(this.model)) {
         const adapter = new ToolCallingAdapter(this.model);
         return adapter.bindTools(tools, options);
      }

      // Fallback - возвращаем модель как есть
      console.warn('[WARN] Модель не поддерживает tool calling, возвращаем без изменений');
      return this.model;
   }

   /**
    * Проверяет, является ли модель LangChain моделью
    */
   isLangChainModel(model: any): model is BaseLanguageModel {
      return model &&
         typeof model.invoke === 'function' &&
         (typeof model.bindTools === 'function' ||
            typeof (model as any).withTools === 'function' ||
            typeof (model as any).withFunctions === 'function' ||
            typeof (model as any).bind === 'function');
   }

   /**
    * Проверяет, является ли модель кастомной моделью с интерфейсом BaseInvokeModel
    */
   isCustomModel(model: any): model is BaseInvokeModel {
      return model &&
         typeof model.invoke === 'function' &&
         !this.isLangChainModel(model);
   }

   /**
    * Получает оригинальную модель
    */
   getModel(): BaseLanguageModel | BaseInvokeModel {
      return this.model;
   }

   /**
    * Получает привязанные инструменты
    */
   getTools(): ToolInterface[] {
      return this.tools;
   }
}

/**
 * Фабричная функция для создания адаптера модели
 */
export function createModelAdapter(model: BaseLanguageModel | BaseInvokeModel): ModelAdapter {
   return new ModelAdapter(model);
}

/**
 * Упрощенная функция для привязки инструментов к модели
 * Заменяет громоздкую ensureToolCalling
 */
export function bindToolsToModel(
   model: BaseLanguageModel | BaseInvokeModel,
   tools: ToolInterface[],
   options: { tool_choice?: 'auto' | 'required' } = {}
): any {
   const adapter = createModelAdapter(model);
   const boundModel = adapter.bindTools(tools, options);

   // Если это LangChain модель, возвращаем как есть
   if (adapter.isLangChainModel(model)) {
      return boundModel;
   }

   // Для кастомных моделей возвращаем boundModel напрямую
   // ToolCallingAdapter уже возвращает правильный объект с invoke методом
   return boundModel;
}
