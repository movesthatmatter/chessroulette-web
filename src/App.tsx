import React from 'react';
import './App.css';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LandingPage } from './modules/Landing/LandingPage';
import { GamePage } from './modules/Game/GamePage';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <TransitionGroup component={null}>
        <Switch location={location}>
          <Route exact path="/game" key={location.key}>
            {({ match }) => (
              <CSSTransition
                in={match !== null}
                key={location.key}
                classNames="gameComponent"
                timeout={600}
                unmountOnExit
              >
                <div className="gameComponent">
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
                classNames="LandingPageContainer"
                timeout={600}
                unmountOnExit
              >
                <div className="LandingPageContainer">
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

export default App;
