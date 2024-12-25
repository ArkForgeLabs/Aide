export type ThemeColor = 'blue' | 'pink' | 'purple' | 'green';
export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export const themes: Record<ThemeMode, Record<ThemeColor, ThemeColors>> = {
  light: {
    blue: {
      primary: '#3498db',
      secondary: '#2980b9',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
    },
    pink: {
      primary: '#e84393',
      secondary: '#d63031',
      background: '#fff0f3',
      surface: '#ffffff',
      text: '#2d3436',
      textSecondary: '#636e72',
    },
    purple: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      background: '#f5f3f7',
      surface: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
    },
    green: {
      primary: '#00b894',
      secondary: '#00a884',
      background: '#f0fff4',
      surface: '#ffffff',
      text: '#2d3436',
      textSecondary: '#636e72',
    },
  },
  dark: {
    blue: {
      primary: '#3498db',
      secondary: '#2980b9',
      background: '#1a1b1e',
      surface: '#2d3436',
      text: '#ffffff',
      textSecondary: '#b2bec3',
    },
    pink: {
      primary: '#e84393',
      secondary: '#d63031',
      background: '#1a181f',
      surface: '#2d2d3f',
      text: '#ffffff',
      textSecondary: '#b2bec3',
    },
    purple: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      background: '#17181f',
      surface: '#2d2d3f',
      text: '#ffffff',
      textSecondary: '#b2bec3',
    },
    green: {
      primary: '#00b894',
      secondary: '#00a884',
      background: '#1a1f1e',
      surface: '#2d3436',
      text: '#ffffff',
      textSecondary: '#b2bec3',
    },
  },
};
