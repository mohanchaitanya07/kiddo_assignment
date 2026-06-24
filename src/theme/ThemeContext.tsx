import React, { createContext, useContext } from 'react';
import type { Theme } from '../types/sdui';

// OTA theming: the payload's theme is pushed into context at the root and
// sampled by every skinnable child, so a server palette change re-skins the app.
const FALLBACK_THEME: Theme = {
  primary: '#FF9933',
  background: '#FFF5E6',
  card: '#FFFFFF',
  accent: '#FF6F00',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
};

const ThemeContext = createContext<Theme>(FALLBACK_THEME);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}): React.JSX.Element {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
