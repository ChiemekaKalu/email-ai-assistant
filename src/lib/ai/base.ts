import { AIProvider, AIConfig } from './types';

export abstract class BaseAIProvider implements AIProvider {
  protected config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  abstract summarizeEmail(content: string): Promise<string>;
  abstract generateResponse(content: string): Promise<string>;
  abstract analyzeImportance(subject: string, content: string): Promise<'high' | 'low'>;
}
