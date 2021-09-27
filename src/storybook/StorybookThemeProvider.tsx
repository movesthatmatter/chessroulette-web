import { ThemeProvider } from "react-jss"
import { lightTheme } from "src/theme"
import React from 'react';


export const StorybookThemeProvider: React.FC = (props) => {
  return (
    <ThemeProvider theme={lightTheme}>
      {props.children}
    </ThemeProvider>
  )
}