import React, { useEffect } from 'react';
import { AuthenticationProvider } from './services/Authentication';
import { Routes } from './Routes';
import { JssProvider, ThemeProvider } from 'react-jss';
import config from './config';
import { GA } from './services/Analytics';
import { ScrollToTop } from './components/ScrollToTop';
import { LichessProvider } from './modules/LichessPlay/LichessAPI/LichessProvider';
import { FeedbackProvider } from './providers/FeedbackProvider/FeedbackProvider';
import { useLightDarkMode } from './theme/hooks/useLightDarkMode';
import { darkTheme, lightTheme } from './theme';

function App() {
  const { theme } = useLightDarkMode();

  useEffect(() => {
    GA.init();
  }, []);

  return (
    <AuthenticationProvider>
      <LichessProvider>
        <JssProvider
          // Prefix the Mounted classes but not the prerendered ones
          // This is to avoid style conflict between new and stale
          //  prerendererd classes since those can't be removed (for now)
          // The idea of prefixing the mounted classes is to decrease the
          //  initial html size as much as possible!
          classNamePrefix={config.PRERENDERING ? undefined : 'cr-'}
          id={{ minify: !config.DEBUG }}
        >
          <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <FeedbackProvider>
              <Routes />
              <ScrollToTop />
            </FeedbackProvider>
          </ThemeProvider>
        </JssProvider>
      </LichessProvider>
    </AuthenticationProvider>
  );
}

export default App;
