import React from 'react';
import { fonts, themes } from 'src/theme';
import { ThemeProvider } from 'react-jss';
import { useSelector } from 'react-redux';
import { selectTheme } from 'src/theme/redux/selectors';
import { DarkModeSwitch } from 'src/components/DarkModeSwitch/DarkModeSwitch';

export const StorybookThemeProvider: React.FC = (props) => {
  const theme = useSelector(selectTheme);
  const selectedTheme = theme === 'lightDefault' ? themes.lightDefault : themes.darkDefault;
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
          color: selectedTheme.text.baseColor,
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
