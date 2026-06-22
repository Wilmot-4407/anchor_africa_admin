import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'anchor-theme';
const SYNC_EVENT  = 'anchor-theme-change';

function getStored(): Theme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark';
  } catch {
    return 'dark';
  }
}

function applyClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStored);

  // Apply class whenever theme state changes
  useEffect(() => {
    applyClass(theme);
  }, [theme]);

  // Listen for changes triggered by other component instances
  useEffect(() => {
    const handler = (e: Event) => {
      setTheme((e as CustomEvent<Theme>).detail);
    };
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* noop */ }
    applyClass(next);
    setTheme(next);
    window.dispatchEvent(new CustomEvent<Theme>(SYNC_EVENT, { detail: next }));
  }, [theme]);

  return { theme, isDark: theme === 'dark', toggleTheme };
}
