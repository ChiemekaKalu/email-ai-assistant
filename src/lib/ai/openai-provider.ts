import { BaseAIProvider } from './base';
import { AIConfig } from './types';
import OpenAI from 'openai';
import AICache from './cache';
import { RateLimiter } from './rate-limiter';

export class OpenAIProvider extends BaseAIProvider {
  private client: OpenAI;
  private cache: AICache;
  private rateLimiter: RateLimiter;

  constructor(config: AIConfig) {
    super(config);
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.cache = AICache.getInstance();
    this.rateLimiter = RateLimiter.getInstance();

    // Configure rate limiter for OpenAI's limits
    this.rateLimiter.configure({
      maxRequests: 20,      // Adjust based on your OpenAI plan
      timeWindow: 60 * 1000, // 1 minute
      retryAfter: 3000      // 3 seconds
    });
  }

  async summarizeEmail(content: string): Promise<string> {
    try {
      // Check cache first
      const cached = await this.cache.get('summary', content);
      if (cached) return cached;

      // Rate limit and make API call
      const summary = await this.rateLimiter.rateLimit(async () => {
        const response = await this.client.chat.completions.create({
          model: this.config.modelName || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that summarizes emails concisely and professionally.'
            },
            {
              role: 'user',
              content: `Please provide a brief summary of this email: ${content}`
            }
          ],
          max_tokens: 150,
          temperature: 0.3,
        });

        return response.choices[0]?.message?.content || 'Unable to generate summary';
      });

      // Cache the result
      await this.cache.set('summary', content, summary);
      return summary;
    } catch (error) {
      console.error('Error summarizing email:', error);
      return 'Error generating summary';
    }
  }

  async generateResponse(content: string): Promise<string> {
    try {
      // Check cache first
      const cached = await this.cache.get('response', content);
      if (cached) return cached;

      // Rate limit and make API call
      const response = await this.rateLimiter.rateLimit(async () => {
        const completion = await this.client.chat.completions.create({
          model: this.config.modelName || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps draft professional email responses. ' +
                       'Keep responses concise, professional, and appropriate for business communication.'
            },
            {
              role: 'user',
              content: `Please suggest a professional response to this email: ${content}`
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || 'Unable to generate response';
      });

      // Cache the result
      await this.cache.set('response', content, response);
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Error generating response';
    }
  }

  async analyzeImportance(subject: string, content: string): Promise<'high' | 'low'> {
    try {
      const cacheKey = `${subject}\n${content}`;
      // Check cache first
      const cached = await this.cache.get('importance', cacheKey);
      if (cached) return cached as 'high' | 'low';

      // Rate limit and make API call
      const importance = await this.rateLimiter.rateLimit(async () => {
        const response = await this.client.chat.completions.create({
          model: this.config.modelName || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that analyzes email importance. ' +
                       'Respond only with "high" or "low". Consider factors like urgency, ' +
                       'sender role, deadlines, and critical business impact.'
            },
            {
              role: 'user',
              content: `Please analyze the importance of this email.\nSubject: ${subject}\nContent: ${content}\n` +
                       'Respond only with "high" or "low".'
            }
          ],
          max_tokens: 10,
          temperature: 0.1,
        });

        return response.choices[0]?.message?.content?.toLowerCase().trim() as 'high' | 'low';
      });

      // Cache the result
      await this.cache.set('importance', cacheKey, importance);
      return importance;
    } catch (error) {
      console.error('Error analyzing importance:', error);
      return 'low'; // Default to low importance on error
    }
  }
}
