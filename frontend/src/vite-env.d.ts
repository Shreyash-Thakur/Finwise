/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_HEALTH_URL: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_AUTH_LOGIN_URL: string;
  readonly VITE_AUTH_REGISTER_URL: string;
  readonly VITE_AUTH_REFRESH_URL: string;
  readonly VITE_AUTH_LOGOUT_URL: string;
  readonly VITE_USER_PROFILE_URL: string;
  readonly VITE_PORTFOLIO_URL: string;
  readonly VITE_MARKET_URL: string;
  readonly VITE_NEWS_URL: string;
  readonly VITE_GOALS_URL: string;
  readonly VITE_ACCOUNTS_URL: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}