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
- `openai-provider.ts`: Implementation of OpenAI's GPT models

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

### OpenAI Provider
- Implementation of OpenAI's GPT models
- Supports various model configurations
- Handles rate limiting and caching

## OpenAI Implementation Specification

### Configuration
- **Model**: Uses `gpt-3.5-turbo` by default, configurable via `modelName` in AIConfig
- **API Key**: Required via `apiKey` in AIConfig
- **Rate Limiting**: 
  - 20 requests per minute
  - 3-second retry delay on rate limit exceeded
  - Implemented via RateLimiter singleton

### Caching
- Implemented via AICache singleton
- Caches results for all operations (summary, response, importance)
- Cache keys based on input content/parameters
- Helps reduce API costs and improve response times

### Core Functions

#### 1. Email Summarization
```typescript
async summarizeEmail(content: string): Promise<string>
```
- **Model Config**:
  - Temperature: 0.3 (low for consistent, factual summaries)
  - Max Tokens: 150 (brief summaries)
- **System Prompt**: "You are an AI assistant that summarizes emails concisely and professionally."
- **Error Handling**: Returns "Error generating summary" on failure

#### 2. Response Generation
```typescript
async generateResponse(content: string): Promise<string>
```
- **Model Config**:
  - Temperature: 0.7 (higher for creative responses)
  - Max Tokens: 200 (longer for full responses)
- **System Prompt**: Focuses on professional business communication
- **Error Handling**: Returns "Error generating response" on failure

#### 3. Importance Analysis
```typescript
async analyzeImportance(subject: string, content: string): Promise<'high' | 'low'>
```
- **Model Config**:
  - Temperature: 0.1 (very low for consistent classification)
  - Max Tokens: 10 (minimal for binary response)
- **System Prompt**: Strict instruction to respond only with "high" or "low"
- **Analysis Factors**:
  - Urgency indicators
  - Sender role context
  - Deadlines
  - Business impact
- **Error Handling**: Defaults to "low" importance on failure

### Performance Optimizations

1. **Concurrent Rate Limiting**
   - Queues requests when rate limit is reached
   - Automatically retries after delay
   - Prevents API errors from rate limiting

2. **Smart Caching**
   - Reduces API calls for repeated content
   - Cache invalidation handled automatically
   - Improves response time for common emails

3. **Error Resilience**
   - Graceful fallbacks for all operations
   - Detailed error logging
   - Never throws errors to client code

### Integration Notes

1. **Setup Requirements**
   ```typescript
   const config: AIConfig = {
     provider: 'openai',
     apiKey: 'your-api-key',
     modelName: 'gpt-3.5-turbo' // optional
   };
   ```

2. **Best Practices**
   - Initialize provider once and reuse
   - Handle rate limits gracefully
   - Monitor API usage via logging
   - Cache aggressively for common patterns

3. **Error Handling**
   - All methods return safe defaults on error
   - Errors are logged but not propagated
   - Cache used as fallback when available

## Usage

### Basic Usage

```typescript
import { createAIProvider } from './factory';
import { AIConfig } from './types';

const config: AIConfig = {
  provider: 'local',  // or 'opensource' or 'openai'
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

// OpenAI provider
const openAIConfig: AIConfig = {
  provider: 'openai',
  apiKey: 'your-api-key',
  modelName: 'gpt-3.5-turbo' // optional
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
