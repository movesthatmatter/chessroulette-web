import React from 'react';
import { useLocation } from 'react-router-dom';
import { Grommet, Box } from 'grommet';
import { SocketProvider } from './components/SocketProvider';
import { createUseStyles } from './lib/jss';
import { defaultTheme } from './theme';
import { ReduxProvider } from './redux/Provider';
import { AuthenticationProvider } from './services/Authentication';
import config from './config';
import { Routes } from './Routes';

function App() {
  const cls = useStyles();

  return (
    <ReduxProvider>
      <AuthenticationProvider>
        <Grommet theme={defaultTheme} full>
          <Box className={cls.container}>
            <Routes />
          </Box>
        </Grommet>
      </AuthenticationProvider>
    </ReduxProvider>
  );
}

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    fontFamily: 'Roboto',
  },
});

export default App;
