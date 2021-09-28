import React, { useContext } from 'react';
import { StorybookThemeContext,ContextProps } from "./StorybookThemeContext";

export const useStorybookThemeProvider = (): ContextProps  => {
  const context = useContext(StorybookThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {}
    };
  }
  return context;
}