import React from 'react';
import { Box } from 'grommet';
import { createUseStyles } from './lib/jss';
import { defaultTheme } from './theme';
import { ReduxProvider } from './redux/Provider';
import { AuthenticationProvider } from './services/Authentication';
import { Routes } from './Routes';
import { ThemeProvider } from 'react-jss';
import { PeerProvider } from './components/PeerProvider';
import { SocketProvider } from './components/SocketProvider';
import { GA } from './services/Analytics';

function App() {
  const cls = useStyles();

  return (
    <ReduxProvider>
      <AuthenticationProvider>
        <SocketProvider>
          <PeerProvider>
            <ThemeProvider theme={defaultTheme}>
              <Box className={cls.container}>
                {GA.init() && <GA.RouteTracker />}
                <Routes />
              </Box>
            </ThemeProvider>
          </PeerProvider>
        </SocketProvider>
      </AuthenticationProvider>
    </ReduxProvider>
  );
}

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    fontFamily: 'Lato, Open Sans, Roboto Slab, sans-serif',
  },
});

export default App;
