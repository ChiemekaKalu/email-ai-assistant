import { initializeAI } from '../lib/ai/config';
import { createAIProvider } from '../lib/ai/factory';

interface EmailData {
  subject: string;
  content: string;
}

interface EmailAnalysis {
  summary: string;
  importance: 'high' | 'low';
  suggestedResponse?: string;
}

// Initialize AI provider
async function initializeAIProvider() {
  const config = await initializeAI();
  return createAIProvider(config);
}

// Initialize on install, update, and startup
chrome.runtime.onInstalled.addListener(async () => {
  await initializeAIProvider();
});

chrome.runtime.onStartup.addListener(async () => {
  await initializeAIProvider();
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ANALYZE_EMAIL') {
    handleEmailAnalysis(message.data).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
});

// Handle email analysis requests
async function handleEmailAnalysis(emailData: EmailData) {
  try {
    const ai = await createAIProvider(await initializeAI());
    if (!ai) {
      throw new Error('AI provider not initialized');
    }

    // Perform comprehensive email analysis
    const [summary, importance, suggestedResponse] = await Promise.all([
      ai.summarizeEmail(emailData.content),
      ai.analyzeImportance(emailData.subject, emailData.content),
      ai.generateResponse(emailData.content)
    ]);

    const analysis: EmailAnalysis = {
      summary,
      importance,
      suggestedResponse
    };

    return { success: true, data: analysis };
  } catch (error) {
    console.error('Error analyzing email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
