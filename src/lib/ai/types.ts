export interface AIProvider {
  summarizeEmail(content: string): Promise<string>;
  generateResponse(content: string): Promise<string>;
  analyzeImportance(subject: string, content: string): Promise<'high' | 'low'>;
}

export interface AIConfig {
  provider: string;
  apiKey?: string;
  apiEndpoint?: string;
  modelName?: string;
}
