import React, { useState } from 'react';
import { darkTheme, fonts, lightTheme } from 'src/theme';
import { ThemeProvider } from 'react-jss';
import { useSelector } from 'react-redux';
import { selectTheme } from 'src/theme/redux/selectors';
import { DarkModeSwitch } from 'src/components/DarkModeSwitch/DarkModeSwitch';

export const StorybookThemeProvider: React.FC = (props) => {
  const theme = useSelector(selectTheme);
  const selectedTheme = theme === 'light' ? lightTheme : darkTheme;
  return (
    <ThemeProvider theme={selectedTheme}>
      <div
        style={{
          backgroundColor: selectedTheme.colors.background,
          height: '100%',
          width: '100%',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
          padding: '10px',
          color: selectedTheme.colors.text,
          fontFamily: 'Lato',
          ...fonts.body1,
        }}
      >
        <div style={{marginBottom: '10px'}}>
          <DarkModeSwitch/>
        </div>
        {props.children}
      </div>
    </ThemeProvider>
  );
};
