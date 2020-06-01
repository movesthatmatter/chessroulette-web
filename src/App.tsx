import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Grommet } from 'grommet';
import { SocketProvider } from './components/SocketProvider';
import { createUseStyles } from './lib/jss';
import { GameRoomPage } from './modules/GameRoom';
import { GA } from './services/Analytics';
import { OnboardingPage } from './modules/Onboarding/OnboardingPage';
import { defaultTheme } from './theme';
import { ClassRoomPage } from './modules/ClassRoom/ClassRoomPage';
import { ReduxProvider } from './redux/Provider';


function App() {
  const location = useLocation();
  const cls = useStyles();

  return (
    <ReduxProvider>
      <SocketProvider>
        <div className={cls.container}>
          <TransitionGroup component={null}>
            { GA.init() && <GA.RouteTracker /> }
            <Switch location={location}>
              <Route exact path="/gameroom/:id/:code?" key={location.key}>
                {({ match }) => (
                  <CSSTransition
                    in={match !== null}
                    key={location.key}
                    timeout={600}
                    unmountOnExit
                  >
                    <GameRoomPage />
                  </CSSTransition>
                )}
              </Route>
              <Route exact path="/classroom/:id/:code?" key={location.key}>
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
                    <Grommet theme={defaultTheme} full>
                      <OnboardingPage />
                    </Grommet>
                  </CSSTransition>
                )}
              </Route>
            </Switch>
          </TransitionGroup>
        </div>
      </SocketProvider>
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
