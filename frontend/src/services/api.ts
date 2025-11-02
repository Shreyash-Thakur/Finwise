// API Configuration and Service Layer
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Token management
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken');
    }
    return this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }
}

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth response interfaces
interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    kycStatus: string;
    role: string;
    avatar?: string;
    authProvider?: string;
  };
}

// HTTP Client
class HttpClient {
  private tokenManager = TokenManager.getInstance();

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;
      
      const headers: Record<string, string> = {
        ...API_CONFIG.headers,
      };

      // Add custom headers
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      // Add auth token if available
      const token = this.tokenManager.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for refresh token
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token refresh if needed
        if (response.status === 401 && token) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request
            return this.makeRequest(url, options);
          } else {
            this.tokenManager.clearToken();
            window.location.href = '/login';
          }
        }

        return {
          success: false,
          error: data.error || data.message || 'Request failed',
          data: data,
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(import.meta.env.VITE_AUTH_REFRESH_URL, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          this.tokenManager.setToken(data.accessToken);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new HttpClient();
export const tokenManager = TokenManager.getInstance();

// API Service Classes
export class AuthService {
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    
    if (response.success && response.data?.accessToken) {
      tokenManager.setToken(response.data.accessToken);
    }
    
    return response;
  }

  async loginLocal(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/login/local', { email, password });
    
    if (response.success && response.data?.accessToken) {
      tokenManager.setToken(response.data.accessToken);
    }
    
    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (response.success && response.data?.accessToken) {
      tokenManager.setToken(response.data.accessToken);
    }
    
    return response;
  }

  async logout() {
    const response = await apiClient.post('/auth/logout');
    tokenManager.clearToken();
    return response;
  }

  async getCurrentUser() {
    return apiClient.get('/auth/me');
  }
}

export class PortfolioService {
  async getPortfolio() {
    return apiClient.get('/portfolio');
  }

  async getHoldings() {
    return apiClient.get('/portfolio/holdings');
  }

  async getTransactions() {
    return apiClient.get('/portfolio/transactions');
  }
}

export class MarketService {
  async getMarketData() {
    return apiClient.get('/market');
  }

  async getStockPrice(symbol: string) {
    return apiClient.get(`/market/price/${symbol}`);
  }

  async searchStocks(query: string) {
    return apiClient.get(`/market/search?q=${encodeURIComponent(query)}`);
  }
}

export class NewsService {
  async getNews() {
    return apiClient.get('/news');
  }

  async getMarketNews() {
    return apiClient.get('/news/market');
  }
}

export class GoalsService {
  async getGoals() {
    return apiClient.get('/goals');
  }

  async createGoal(goalData: any) {
    return apiClient.post('/goals', goalData);
  }

  async updateGoal(id: string, goalData: any) {
    return apiClient.put(`/goals/${id}`, goalData);
  }

  async deleteGoal(id: string) {
    return apiClient.delete(`/goals/${id}`);
  }
}

// Export service instances
export const authService = new AuthService();
export const portfolioService = new PortfolioService();
export const marketService = new MarketService();
export const newsService = new NewsService();
export const goalsService = new GoalsService();

// Health check utility
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(import.meta.env.VITE_API_HEALTH_URL);
    return response.ok;
  } catch {
    return false;
  }
};