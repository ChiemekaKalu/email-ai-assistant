interface CacheEntry {
  value: string;
  timestamp: number;
}

interface CacheData {
  [key: string]: CacheEntry;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class AICache {
  private static instance: AICache;
  private cache: CacheData = {};

  private constructor() {
    this.loadCache();
  }

  static getInstance(): AICache {
    if (!AICache.instance) {
      AICache.instance = new AICache();
    }
    return AICache.instance;
  }

  private async loadCache() {
    try {
      const result = await chrome.storage.local.get(['aiCache']);
      this.cache = (result.aiCache as CacheData) || {};
      this.cleanCache();
    } catch (error) {
      console.error('Error loading cache:', error);
      this.cache = {};
    }
  }

  private async saveCache() {
    try {
      await chrome.storage.local.set({ aiCache: this.cache });
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  private cleanCache() {
    const now = Date.now();
    Object.entries(this.cache).forEach(([key, entry]) => {
      if (now - entry.timestamp > CACHE_DURATION) {
        delete this.cache[key];
      }
    });
  }

  private generateKey(type: string, content: string): string {
    return `${type}:${content}`;
  }

  async get(type: string, content: string): Promise<string | null> {
    const key = this.generateKey(type, content);
    const entry = this.cache[key];
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      delete this.cache[key];
      await this.saveCache();
      return null;
    }
    
    return entry.value;
  }

  async set(type: string, content: string, value: string): Promise<void> {
    const key = this.generateKey(type, content);
    this.cache[key] = {
      value,
      timestamp: Date.now()
    };
    await this.saveCache();
  }

  async clear(): Promise<void> {
    this.cache = {};
    await this.saveCache();
  }
}

export default AICache;
