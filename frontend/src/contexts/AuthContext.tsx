import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService, tokenManager } from '../services/api';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginWithToken: (user: User, token: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'AUTH_START' });
        
        // First try to get user from session-based auth (includes cookies)
        const response = await fetch('http://localhost:5001/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Important: include cookies for session auth
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            const user: User = {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              kycStatus: result.user.kycStatus || 'pending',
              role: result.user.role || 'user'
            };
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return;
          }
        }

        // Fallback: check for JWT token
        const token = tokenManager.getToken();
        if (token) {
          const apiResponse = await authService.getCurrentUser();
          if (apiResponse.success && apiResponse.data) {
            const user: User = apiResponse.data as any;
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return;
          }
        }

        // No valid authentication found
        tokenManager.clearToken();
        dispatch({ type: 'AUTH_LOGOUT' });
        
      } catch (error) {
        console.error('Auth check error:', error);
        tokenManager.clearToken();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Try session-based login first (for dual authentication support)
      const response = await authService.loginLocal(email, password);
      
      if (response.success && response.data) {
        const authData = response.data as any;
        const user: User = {
          id: authData.user?.id || authData.id,
          email: authData.user?.email || authData.email,
          name: authData.user?.name || authData.name,
          kycStatus: authData.user?.kycStatus || authData.kycStatus || 'pending',
          role: authData.user?.role || authData.role || 'user'
        };
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      return false;
    }
  };

  const loginWithToken = async (user: User, token: string): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Store the JWT token
      tokenManager.setToken(token);
      
      // Validate the token by fetching user data
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          const validatedUser: User = response.data as any;
          dispatch({ type: 'AUTH_SUCCESS', payload: validatedUser });
          return true;
        }
      } catch (error) {
        // If token validation fails, use the provided user data
        console.warn('Token validation failed, using provided user data:', error);
      }
      
      // Use the provided user data
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return true;
    } catch (error) {
      tokenManager.clearToken();
      dispatch({
        type: 'AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'Token login failed',
      });
      return false;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        const authData = response.data as any;
        const user: User = authData.user || authData;
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error || 'Registration failed' });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Try session-based logout first
      await fetch('http://localhost:5001/api/auth/logout/session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Also clear JWT token if exists
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setUser = (user: User) => {
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginWithToken,
    register,
    logout,
    clearError,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}