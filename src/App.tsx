import React from 'react';
import { defaultTheme } from './theme';
import { ReduxProvider } from './redux/Provider';
import { AuthenticationProvider } from './services/Authentication';
import { Routes } from './Routes';
import { JssProvider, ThemeProvider } from 'react-jss';
import { PeerProvider } from './components/PeerProvider';
import { SocketProvider } from './components/SocketProvider';
import { GA } from './services/Analytics';
import config from './config';

function App() {
  return (
    <ReduxProvider>
      <AuthenticationProvider>
        <SocketProvider>
          <PeerProvider>
            <JssProvider
              // Prefix the Mounted classes but not the prerendered ones
              // This is to avoid style conflict between new and stale
              //  prerendererd classes since those can't be removed (for now)
              // The idea of prefixing the mounted classes is to decrease the
              //  initial html size as much as possible!
              classNamePrefix={config.PRERENDERING ? undefined : 'cr-'}
              id={{ minify: !config.DEBUG }}
            >
              <ThemeProvider theme={defaultTheme}>
                {GA.init() && <GA.RouteTracker />}
                <Routes />
              </ThemeProvider>
            </JssProvider>
          </PeerProvider>
        </SocketProvider>
      </AuthenticationProvider>
    </ReduxProvider>
  );
}

export default App;
