import { BaseAIProvider } from './base';
import { AIConfig } from './types';

export class OpenSourceProvider extends BaseAIProvider {
  private endpoint: string;

  constructor(config: AIConfig) {
    super(config);
    this.endpoint = config.apiEndpoint || 'http://localhost:3000';
  }

  async summarizeEmail(content: string): Promise<string> {
    try {
      return await this.callLocalModel(`Summarize this email: ${content}`);
    } catch (error) {
      console.error('Error summarizing email:', error);
      return this.fallbackResponse('Unable to generate summary. Using fallback response.');
    }
  }

  async generateResponse(content: string): Promise<string> {
    try {
      return await this.callLocalModel(`Generate a professional response to this email: ${content}`);
    } catch (error) {
      console.error('Error generating response:', error);
      return this.fallbackResponse('Unable to generate response. Using fallback response.');
    }
  }

  async analyzeImportance(subject: string, content: string): Promise<'high' | 'low'> {
    try {
      const result = await this.callLocalModel(
        `Analyze the importance of this email (respond only with "high" or "low"):\nSubject: ${subject}\nContent: ${content}`
      );
      return result.toLowerCase().trim() as 'high' | 'low';
    } catch (error) {
      console.error('Error analyzing importance:', error);
      return 'low';
    }
  }

  private async callLocalModel(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Error calling local model:', error);
      throw error;
    }
  }

  private fallbackResponse(message: string): string {
    console.warn('Using fallback response:', message);
    return message;
  }
}
