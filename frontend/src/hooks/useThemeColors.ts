import { useEffect, useState } from 'react';
import { getStoredTheme, type Theme } from '../lib/theme';
export interface ThemeColors {
  // Chart colors
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  danger: string;

  // Chart elements
  text: string;
  grid: string;
  axis: string;
  tooltip: {
    bg: string;
    border: string;
    text: string;
  };

  // Background
  background: string;
  cardBg: string;
}
export function useThemeColors(): ThemeColors {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme);
    };

    // Listen for custom theme change event
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);
  if (theme === 'dark') {
    return {
      primary: '#3B82F6',
      secondary: '#14B8A6',
      tertiary: '#A78BFA',
      success: '#22C55E',
      warning: '#FBB F24',
      danger: '#F87171',
      text: '#94A3B8',
      grid: '#334155',
      axis: '#475569',
      tooltip: {
        bg: '#1E293B',
        border: '#334155',
        text: '#F1F5F9'
      },
      background: '#0F172A',
      cardBg: '#1E293B'
    };
  }

  // Light theme (default)
  return {
    primary: '#2563EB',
    secondary: '#0D9488',
    tertiary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    text: '#64748B',
    grid: '#E2E8F0',
    axis: '#CBD5E1',
    tooltip: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      text: '#0F172A'
    },
    background: '#F8FAFC',
    cardBg: '#FFFFFF'
  };
}