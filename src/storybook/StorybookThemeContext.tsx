import { CustomTheme, lightTheme } from "src/theme";
import React from 'react';

export type ContextProps = {
  theme: 'light' | 'dark';
  setTheme: (theme : ContextProps['theme']) => void;
}

export const StorybookThemeContext: React.Context<ContextProps> = React.createContext<ContextProps>({
  theme: 'light',
  setTheme: () => {}
});
