import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Grommet, Box } from 'grommet';
import { SocketProvider, SocketConsumer } from './components/SocketProvider';
import { createUseStyles } from './lib/jss';
import { GameRoomPage } from './modules/GameRoom';
import { GA } from './services/Analytics';
import { OnboardingPage } from './modules/Onboarding/OnboardingPage';
import { defaultTheme } from './theme';
import { ClassRoomPage } from './modules/ClassRoom/ClassRoomPage';
import { ReduxProvider } from './redux/Provider';
import { GameRoomV2Page } from './modules/GameRoomV2/GameRoomV2Page';
import { LandingPageV2 } from './modules/Landing/LandingPageV2';
import { LandingPage } from './modules/Landing/LandingPage';
import { AuthenticationProvider } from './services/Authentication';

function App() {
  const location = useLocation();
  const cls = useStyles();

  return (
    <ReduxProvider>
      <AuthenticationProvider>
        <SocketProvider>
          <Grommet theme={defaultTheme} full>
            <Box className={cls.container}>
              <TransitionGroup component={null}>
                {GA.init() && <GA.RouteTracker />}
                <Switch location={location}>
                  <Route
                    exact
                    path="/gameroom/:id/:code?"
                    key={location.key}
                  >
                    {({ match }) => (
                      <CSSTransition
                        in={match !== null}
                        key={location.key}
                        timeout={600}
                        unmountOnExit
                      >
                        <GameRoomV2Page />
                      </CSSTransition>
                    )}
                  </Route>
                  <Route
                    exact
                    path="/classroom/:id/:code?"
                    key={location.key}
                  >
                    {({ match }) => (
                      <CSSTransition
                        in={match !== null}
                        key={location.key}
                        timeout={600}
                        unmountOnExit
                      >
                        <ClassRoomPage />
                      </CSSTransition>
                    )}
                  </Route>
                  <Route exact strict path="/" key={location.key}>
                    {({ match }) => (
                      <CSSTransition
                        in={match !== null}
                        key={location.key}
                        timeout={600}
                        unmountOnExit
                      >
                        {/* <OnboardingPage /> */}
                        {/* <GameRoomV2Page /> */}
                        <LandingPageV2 />
                        {/* <LandingPage /> */}
                      </CSSTransition>
                    )}
                  </Route>
                </Switch>
              </TransitionGroup>
            </Box>
          </Grommet>
        </SocketProvider>
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
