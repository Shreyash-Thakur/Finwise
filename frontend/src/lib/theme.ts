export type Theme = 'light' | 'dark';
const THEME_KEY = 'finwise_theme_v1';
export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage not available
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to dark
}
export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage not available
  }
}
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  // Set data-theme attribute for CSS variables
  root.setAttribute('data-theme', theme);

  // Also apply class for Tailwind dark mode compatibility
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
export function initTheme(): void {
  const stored = getStoredTheme();
  applyTheme(stored);

  // Listen for system theme changes
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only auto-switch if user hasn't set a preference
      const currentStored = localStorage.getItem(THEME_KEY);
      if (!currentStored) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setStoredTheme(next);
  applyTheme(next);

  // Dispatch custom event for components to listen
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: {
      theme: next
    }
  }));
  return next;
}