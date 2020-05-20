import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LandingPage } from './modules/Landing/LandingPage';
import { SocketProvider } from './components/SocketProvider';
import { createUseStyles } from './lib/jss';
import { GameRoomPage } from './modules/GameRoom';
import { GA } from './services/Analytics';


function App() {
  const location = useLocation();
  const cls = useStyles();

  return (
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
            <Route exact strict path="/" key={location.key}>
              {({ match }) => (
                <CSSTransition
                  in={match !== null}
                  key={location.key}
                  timeout={600}
                  unmountOnExit
                >
                  <LandingPage />
                </CSSTransition>
              )}
            </Route>
          </Switch>
        </TransitionGroup>
      </div>
    </SocketProvider>
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
