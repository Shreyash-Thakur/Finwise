const axios = require('axios');
const { config } = require('../config/env');

class NewsService {
  constructor() {
    this.newsApiKey = config.apis.newsApi.key;
    this.newsApiBaseUrl = 'https://newsapi.org/v2';
    this.marketauxBaseUrl = 'https://api.marketaux.com/v1';
    
    // Cache for news data (2 hours)
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 60 * 1000; // 2 hours
  }

  /**
   * Fetch general financial news from NewsAPI
   */
  async fetchGeneralNews(limit = 20) {
    const cacheKey = 'general-news';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (!this.newsApiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.newsApiBaseUrl}/everything`, {
        params: {
          q: 'finance OR stocks OR market OR economy OR investing',
          sources: 'bloomberg,reuters,financial-times,the-wall-street-journal,cnbc',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: limit,
          apiKey: this.newsApiKey,
        },
      });

      const articles = response.data.articles || [];
      this.setCachedData(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('NewsAPI error:', error);
      return [];
    }
  }

  /**
   * Fetch news for specific tickers/symbols
   */
  async fetchTickerNews(tickers, limit = 10) {
    const cacheKey = `ticker-news-${tickers.join(',')}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (!this.newsApiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      // Create search query with ticker symbols
      const query = tickers.map(ticker => `"${ticker}"`).join(' OR ');
      
      const response = await axios.get(`${this.newsApiBaseUrl}/everything`, {
        params: {
          q: query,
          sources: 'bloomberg,reuters,financial-times,the-wall-street-journal,cnbc,business-insider',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: limit,
          apiKey: this.newsApiKey,
        },
      });

      const articles = response.data.articles || [];
      this.setCachedData(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('NewsAPI error for tickers:', error);
      return [];
    }
  }

  /**
   * Fetch Indian market news
   */
  async fetchIndianMarketNews(limit = 15) {
    const cacheKey = 'indian-market-news';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (!this.newsApiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.newsApiBaseUrl}/everything`, {
        params: {
          q: 'NSE OR BSE OR "Indian stock market" OR "Sensex" OR "Nifty" OR "RBI" OR "SEBI"',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: limit,
          apiKey: this.newsApiKey,
        },
      });

      const articles = response.data.articles || [];
      this.setCachedData(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('NewsAPI error for Indian market:', error);
      return [];
    }
  }

  /**
   * Fetch crypto news
   */
  async fetchCryptoNews(limit = 15) {
    const cacheKey = 'crypto-news';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (!this.newsApiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.newsApiBaseUrl}/everything`, {
        params: {
          q: 'cryptocurrency OR bitcoin OR ethereum OR crypto OR blockchain OR DeFi',
          sources: 'coindesk,cointelegraph',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: limit,
          apiKey: this.newsApiKey,
        },
      });

      const articles = response.data.articles || [];
      this.setCachedData(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('NewsAPI error for crypto:', error);
      return [];
    }
  }

  /**
   * Search news by query
   */
  async searchNews(query, limit = 20) {
    const cacheKey = `search-${query}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (!this.newsApiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.newsApiBaseUrl}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: limit,
          apiKey: this.newsApiKey,
        },
      });

      const articles = response.data.articles || [];
      this.setCachedData(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('NewsAPI search error:', error);
      return [];
    }
  }

  /**
   * Get cached data if still valid
   */
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set data in cache with timestamp
   */
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const entries = this.cache.size;
    let oldestEntry = null;

    for (const [, value] of this.cache) {
      if (oldestEntry === null || value.timestamp < oldestEntry) {
        oldestEntry = value.timestamp;
      }
    }

    return { entries, oldestEntry };
  }
}

module.exports = { NewsService };