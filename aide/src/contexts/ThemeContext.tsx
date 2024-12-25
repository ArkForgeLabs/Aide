import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeColor, ThemeMode, themes } from '../themes';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  toggleMode: () => void;
  setThemeColor: (color: ThemeColor) => void;
  theme: typeof themes.light.blue;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [color, setColor] = useState<ThemeColor>('blue');

  useEffect(() => {
    document.body.setAttribute('data-theme-mode', mode);
    document.body.setAttribute('data-theme-color', color);
  }, [mode, color]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeColor = (newColor: ThemeColor) => {
    setColor(newColor);
  };

  const theme = themes[mode][color];

  return (
    <ThemeContext.Provider value={{ mode, color, toggleMode, setThemeColor, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
