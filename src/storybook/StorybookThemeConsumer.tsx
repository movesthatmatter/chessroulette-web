import React from 'react';
import { darkTheme, lightTheme } from "src/theme";
import { ThemeProvider } from 'react-jss';

type Props = {
  themeName: 'light' | 'dark';
}

export const StorybookThemeConsumer: React.FC<Props> = (props) => {
  const theme = props.themeName === 'light' ? lightTheme : darkTheme;
  
  return (
    <ThemeProvider theme={theme}>
      <div style={{
        backgroundColor: theme.colors.background,
        height: '100%',
        width: '100%',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        position: 'absolute',
        padding: '10px',
      }}>
      {props.children}
      </div>
    </ThemeProvider>
  )
}
