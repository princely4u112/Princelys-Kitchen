import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTerracotta: boolean;
}

const THEME_STORAGE_KEY = 'princelys_kitchen_theme_pref';

const defaultContextValue: ThemeContextType = {
  theme: 'terracotta',
  toggleTheme: () => {},
  setTheme: () => {},
  isTerracotta: true
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Option 2 (terracotta) is the default requested theme
  const [theme, setThemeState] = useState<Theme>('terracotta');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (saved === 'terracotta' || saved === 'dark') {
        setThemeState(saved);
      } else {
        // Default to option 2 (terracotta)
        setThemeState('terracotta');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'terracotta' ? 'dark' : 'terracotta');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isTerracotta: theme === 'terracotta'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context || defaultContextValue;
}
