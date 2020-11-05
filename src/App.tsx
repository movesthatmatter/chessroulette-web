import React from 'react';
import { Box } from 'grommet';
import { createUseStyles } from './lib/jss';
import { defaultTheme } from './theme';
import { ReduxProvider } from './redux/Provider';
import { AuthenticationProvider } from './services/Authentication';
import { Routes } from './Routes';
import { ThemeProvider } from 'react-jss';

function App() {
  const cls = useStyles();

  return (
    <ReduxProvider>
      <AuthenticationProvider>
        <ThemeProvider theme={defaultTheme}>
          <Box className={cls.container}>
            <Routes />
          </Box>
        </ThemeProvider>
      </AuthenticationProvider>
    </ReduxProvider>
  );
}

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    fontFamily: 'Lato, Open Sans, Roboto Slab, sans-serif',
    // fontFamily: 'Roboto',s
  },
});

export default App;
