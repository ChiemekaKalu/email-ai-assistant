import { AIProvider, AIConfig } from './types';
import { LocalAIProvider } from './local-provider';
import { OpenSourceProvider } from './open-source-provider';
import { OpenAIProvider } from './openai-provider';

export function createAIProvider(config: AIConfig): AIProvider {
  switch (config.provider.toLowerCase()) {
    case 'local':
      return new LocalAIProvider(config);
    case 'opensource':
      return new OpenSourceProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}
