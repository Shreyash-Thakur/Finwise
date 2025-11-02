import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { getStoredTheme, toggleTheme, type Theme } from '../../lib/theme';
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme);
    };
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);
  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };
  return <button onClick={handleToggle} className="p-2 rounded-lg transition-colors" style={{
    backgroundColor: 'rgba(var(--muted), 0.5)',
    color: 'rgb(var(--text))'
  }} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
    </button>;
}