import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getAIConfig, saveAIConfig } from '../../lib/ai/config';
import { AIConfig } from '../../lib/ai/types';

export function AISettings() {
  const [config, setConfig] = useState<AIConfig>({ provider: 'local' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    const savedConfig = await getAIConfig();
    setConfig(savedConfig);
  }

  async function handleProviderChange(provider: string) {
    const newConfig = { ...config, provider };
    setConfig(newConfig);
    await saveConfig(newConfig);
  }

  async function handleApiKeyChange(apiKey: string) {
    const newConfig = { ...config, apiKey };
    setConfig(newConfig);
  }

  async function saveConfig(newConfig: AIConfig) {
    setIsSaving(true);
    setMessage(null);
    try {
      await saveAIConfig(newConfig);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              AI Provider
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={config.provider}
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <option value="local">Local (Rule-based)</option>
              <option value="openai">OpenAI</option>
              <option value="opensource">Open Source LLM</option>
            </select>
          </div>

          {config.provider === 'openai' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={config.apiKey || ''}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Your API key is stored securely in Chrome's local storage
              </p>
            </div>
          )}

          {config.provider === 'openai' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Model
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={config.modelName || 'gpt-3.5-turbo'}
                onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </select>
            </div>
          )}

          {message && (
            <div className={`p-2 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <button
            className={`w-full p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => saveConfig(config)}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
