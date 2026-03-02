export const themes = {
  default: {
    bg: '#0a0a0a',
    surface: '#171717',
    surfaceHover: '#262626',
    border: '#262626',
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    accent: '#3b82f6',
    accentHover: '#2563eb',
  },
  warm: {
    bg: '#f5f5f0',
    surface: '#ffffff',
    surfaceHover: '#fafaf9',
    border: '#e5e5e0',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    accent: '#5a5a40',
    accentHover: '#4a4a35',
  }
};

export type ThemeType = keyof typeof themes;
