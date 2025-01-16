import { AIConfig } from './types';

// Load API key from environment or chrome.storage
export async function getAIConfig(): Promise<AIConfig> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['aiConfig'], (result) => {
      if (result.aiConfig?.apiKey) {
        resolve(result.aiConfig);
      } else {
        // Default to local provider if no API key is set
        resolve({
          provider: 'local',
        });
      }
    });
  });
}

// Save API key to chrome.storage
export async function saveAIConfig(config: AIConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ aiConfig: config }, () => {
      resolve();
    });
  });
}

// Update the background script to use the stored configuration
export async function initializeAI(): Promise<AIConfig> {
  const config = await getAIConfig();
  return config;
}
