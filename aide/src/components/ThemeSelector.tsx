import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColor } from '../themes';
import './ThemeSelector.css';

export const ThemeSelector: React.FC = () => {
  const { mode, color, toggleMode, setThemeColor } = useTheme();

  const colors: ThemeColor[] = ['blue', 'pink', 'purple', 'green'];

  return (
    <div className="theme-selector">
      <button 
        className="mode-toggle"
        onClick={toggleMode}
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? '🌙' : '☀️'}
      </button>
      
      <div className="color-options">
        {colors.map((themeColor) => (
          <button
            key={themeColor}
            className={`color-option ${themeColor} ${color === themeColor ? 'active' : ''}`}
            onClick={() => setThemeColor(themeColor)}
            title={`Switch to ${themeColor} theme`}
          />
        ))}
      </div>
    </div>
  );
};
