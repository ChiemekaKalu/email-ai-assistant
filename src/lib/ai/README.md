# AI Provider System

This directory contains the AI provider system for the Email AI Assistant. The system is designed to be modular and provider-agnostic, allowing easy switching between different AI implementations.

## Architecture

The AI system follows a provider pattern with the following components:

### Core Components

- `types.ts`: Defines the core interfaces for AI providers
- `base.ts`: Abstract base class for AI providers
- `factory.ts`: Factory function to create provider instances
- `local-provider.ts`: Simple rule-based implementation for testing
- `open-source-provider.ts`: Template for open-source LLM integration

### Provider Interface

Each provider must implement these core functions:

```typescript
interface AIProvider {
  summarizeEmail(content: string): Promise<string>;
  generateResponse(content: string): Promise<string>;
  analyzeImportance(subject: string, content: string): Promise<'high' | 'low'>;
}
```

## Available Providers

### Local Provider
- Simple rule-based implementation
- No external dependencies
- Perfect for testing and development
- Uses keyword matching and basic text analysis

### Open Source Provider (Template)
- Prepared for integration with open-source LLMs
- Supports local model inference
- Can be implemented with:
  - Local LLM server
  - WebAssembly-based models
  - Native messaging to local model process

## Usage

### Basic Usage

```typescript
import { createAIProvider } from './factory';
import { AIConfig } from './types';

const config: AIConfig = {
  provider: 'local',  // or 'opensource'
  apiEndpoint: 'http://localhost:3000'  // for opensource provider
};

const ai = createAIProvider(config);
const summary = await ai.summarizeEmail(emailContent);
```

### Switching Providers

To switch providers, simply change the configuration:

```typescript
// Local provider
const localConfig: AIConfig = {
  provider: 'local'
};

// Open source provider
const openSourceConfig: AIConfig = {
  provider: 'opensource',
  apiEndpoint: 'http://localhost:3000',
  modelName: 'mistral-7b'  // example
};
```

## Implementing New Providers

1. Create a new provider class extending `BaseAIProvider`
2. Implement the required interface methods
3. Add the provider to the factory function

Example:

```typescript
export class CustomProvider extends BaseAIProvider {
  async summarizeEmail(content: string): Promise<string> {
    // Your implementation
  }

  async generateResponse(content: string): Promise<string> {
    // Your implementation
  }

  async analyzeImportance(subject: string, content: string): Promise<'high' | 'low'> {
    // Your implementation
  }
}
```

## Future Improvements

- [ ] Add more sophisticated local rules
- [ ] Implement specific open-source LLM integrations
- [ ] Add caching layer for responses
- [ ] Add provider-specific configuration UI
- [ ] Implement response streaming
- [ ] Add support for custom prompt templates
