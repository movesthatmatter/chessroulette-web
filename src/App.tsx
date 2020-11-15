import React from 'react';
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
    <>
    <ReduxProvider>
      <AuthenticationProvider>
        <SocketProvider>
          <PeerProvider>
            <ThemeProvider theme={defaultTheme}>
              <div className={cls.container}>
                {GA.init() && <GA.RouteTracker />}
                <Routes />
              </div>
            </ThemeProvider>
          </PeerProvider>
        </SocketProvider>
      </AuthenticationProvider>
    </ReduxProvider>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    fontFamily: 'Lato, Open Sans, sans-serif',
  },
});

export default App;
