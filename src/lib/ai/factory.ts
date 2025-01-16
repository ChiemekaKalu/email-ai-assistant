import { AIProvider, AIConfig } from './types';
import { LocalAIProvider } from './local-provider';
import { OpenSourceAIProvider } from './open-source-provider';
import { OpenAIProvider } from './openai-provider';

export function createAIProvider(config: AIConfig): AIProvider {
  switch (config.provider.toLowerCase()) {
    case 'local':
      return new LocalAIProvider(config);
    case 'opensource':
      return new OpenSourceAIProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    default:
      console.warn(`Unknown provider "${config.provider}", falling back to local provider`);
      return new LocalAIProvider(config);
  }
}
