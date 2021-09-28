import React, { useState } from 'react';
import { StorybookThemeContext } from "./StorybookThemeContext";
import { darkTheme, lightTheme } from "src/theme";
import { ThemeProvider } from 'react-jss';

export const StorybookThemeProvider: React.FC = (props) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
 
  return (
    <StorybookThemeContext.Provider value={{
      theme,
      setTheme
    }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <div>
          {props.children}
        </div>
      </ThemeProvider>
    </StorybookThemeContext.Provider>
  )
}
