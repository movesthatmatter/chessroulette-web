import React, { useEffect } from 'react';
import { AuthenticationProvider } from './services/Authentication';
import { Routes } from './Routes';
import { JssProvider, ThemeProvider } from 'react-jss';
import config from './config';
import { GA } from './services/Analytics';
import { ScrollToTop } from './components/ScrollToTop';
import { LichessProvider } from './modules/LichessPlay/LichessAPI/LichessProvider';
import { FeedbackProvider } from './providers/FeedbackProvider/FeedbackProvider';
import { useColorTheme } from './theme/hooks/useColorTheme';
import { themes } from './theme';

function App() {
  const { theme } = useColorTheme();

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
          //classNamePrefix={config.PRERENDERING ? undefined : 'cr-'}
          //id={{ minify: !config.DEBUG }}
        >
          <ThemeProvider theme={theme.name === 'lightDefault' ? themes.lightDefault : themes.darkDefault}>
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
