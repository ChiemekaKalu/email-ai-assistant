import { BaseAIProvider } from './base';
import { AIConfig } from './types';

export class LocalAIProvider extends BaseAIProvider {
  constructor(config: AIConfig) {
    super(config);
  }

  async summarizeEmail(content: string): Promise<string> {
    // Simple summarization: first 100 characters + ellipsis
    return content.length > 100 
      ? content.substring(0, 100) + '...'
      : content;
  }

  async generateResponse(content: string): Promise<string> {
    // Simple response generation based on keywords
    if (content.toLowerCase().includes('meeting')) {
      return 'Thank you for the meeting request. I will check my calendar and get back to you soon.';
    }
    if (content.toLowerCase().includes('deadline')) {
      return 'I acknowledge the deadline and will work on this promptly.';
    }
    return 'Thank you for your email. I will review and respond soon.';
  }

  async analyzeImportance(subject: string, content: string): Promise<'high' | 'low'> {
    const urgentKeywords = [
      'urgent',
      'asap',
      'important',
      'deadline',
      'critical',
      'emergency'
    ];

    const text = (subject + ' ' + content).toLowerCase();
    return urgentKeywords.some(keyword => text.includes(keyword)) 
      ? 'high' 
      : 'low';
  }
}
