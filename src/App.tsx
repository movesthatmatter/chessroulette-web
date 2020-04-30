import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LandingPage } from './modules/Landing/LandingPage/LandingPage';
import { GamePage } from './modules/Game/GamePage';
import { createUseStyles } from './lib/jss/createUseStyles';


export default function App() {
  const location = useLocation();
  const styles = useStyle();
  return (
    <div className={styles.app}>
      <TransitionGroup component={null}>
        <Switch location={location}>
          <Route exact path="/game" key={location.key}>
            {({ match }) => (
              <CSSTransition
                in={match !== null}
                key={location.key}
                classNames={{
                  enter: styles.gameComponentEnter,
                  enterActive: styles.gameComponentEnterActive,
                  exit: styles.gameComponentExit,
                  exitActive: styles.gameComponentExitActive,
                }}
                timeout={600}
                unmountOnExit
              >
                <div className={styles.gameComponent}>
                  <GamePage />
                </div>
              </CSSTransition>
            )}
          </Route>
          <Route exact strict path="/" key={location.key}>
            {({ match }) => (
              <CSSTransition
                in={match !== null}
                key={location.key}
                classNames={{
                  enter: styles.LandingPageContainerEnter,
                  enterActive: styles.LandingPageContainerEnterActive,
                  exit: styles.LandingPageContainerExit,
                  exitActive: styles.LandingPageContainerExitActive,
                }}
                timeout={600}
                unmountOnExit
              >
                <div className={styles.LandingPageContainer}>
                  <LandingPage />
                </div>
              </CSSTransition>
            )}
          </Route>
        </Switch>
      </TransitionGroup>
    </div>
  );
}

const useStyle = createUseStyles({
  app: {
    fontFamily: 'Roboto, Open Sans, Roboto Slab, sans-serif',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameComponent: {

  },
  LandingPageContainer: {

  },
  LandingPageContainerEnter: {
    opacity: '0',
    transform: 'scale(1.1)',
  },
  LandingPageContainerEnterActive: {
    opacity: '1',
    transform: 'scale(1)',
    transition: 'opacity 600ms, transform 600ms',
  },
  LandingPageContainerExit: {
    opacity: '1',
    transform: 'scale(1)',
  },
  LandingPageContainerExitActive: {
    opacity: '0',
    transform: 'scale(1.2)',
    transition: 'opacity 600ms, transform 600ms',
  },
  gameComponentEnter: {
    opacity: '0',
    transform: 'scale(1.1)',
  },
  gameComponentEnterActive: {
    opacity: '1',
    transform: 'scale(1)',
    transition: 'opacity 600ms, transform 600ms',
  },
  gameComponentExit: {
    opacity: '1',
    transform: 'scale(1)',
  },
  gameComponentExitActive: {
    opacity: '0',
    transform: 'scale(1.2)',
    transition: 'opacity 600ms, transform 600ms',
  },
});
