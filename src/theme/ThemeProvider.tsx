import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

type ThemeContextValue = {
  theme: Theme;
  direction: Direction;
  setTheme: (theme: Theme) => void;
  setDirection: (direction: Direction) => void;
};

const themeStorageKey = 'aegishealth-theme';
const languageStorageKey = 'aegishealth-language';

const readStoredValue = <Value extends string>(key: string, fallback: Value, allowed: readonly Value[]): Value => {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key) as Value | null;
  return stored && allowed.includes(stored) ? stored : fallback;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStoredValue(themeStorageKey, 'light', ['light', 'dark']));
  const [direction, setDirection] = useState<Direction>(() => readStoredValue(languageStorageKey, 'ltr', ['ltr', 'rtl']));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
    window.localStorage.setItem(themeStorageKey, theme);
    window.localStorage.setItem(languageStorageKey, direction);
  }, [direction, theme]);

  return (
    <ThemeContext.Provider value={{ theme, direction, setTheme, setDirection }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
