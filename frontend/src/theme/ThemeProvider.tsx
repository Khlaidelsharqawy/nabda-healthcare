import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

type ThemeContextValue = {
  theme: Theme;
  direction: Direction;
  setTheme: (theme: Theme) => void;
  setDirection: (direction: Direction) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
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
