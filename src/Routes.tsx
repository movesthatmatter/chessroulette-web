import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LichessAuthCallbackPage } from './services/Authentication/widgets/LichessAuthCallbackPage';
import { StatsPage } from './modules/Stats';
import { ChallengePage } from './modules/Challenges';
import { GenericRoomPage } from './modules/GenericRoom';
import { LandingPageV2 } from './modules/Landing/LandingPageV2';
import { GA } from './services/Analytics';
import { SocketConsumer, SocketProvider } from './components/SocketProvider';
import { useSelector } from 'react-redux';
import { selectAuthentication } from './services/Authentication';
import { PeerConsumer, PeerProvider } from './components/PeerProvider';
import { IceServerRecord } from 'dstnd-io';
import { resources } from './resources';

type Props = {};

export const Routes: React.FC<Props> = (props) => {
  const location = useLocation();
  const auth = useSelector(selectAuthentication);
  const [iceServers, setIceServers] = useState<IceServerRecord[]>();

  useEffect(() => {
    (async () => {
      (await resources.getIceURLS()).map(setIceServers);
    })();
  }, []);

  if (auth.authenticationType === 'none') {
    return null;
  }

  if (!iceServers) {
    return null;
  }

  return (
    <SocketProvider>
      <PeerProvider user={auth.user} iceServers={iceServers}>
        <PeerConsumer
          render={() => (
            <TransitionGroup component={null}>
              {GA.init() && <GA.RouteTracker />}
              <Switch location={location}>
                <Route path="/auth/lichess/callback" exact component={LichessAuthCallbackPage} />
                <Route exact strict path="/stats" key={location.key}>
                  {({ match }) => (
                    <CSSTransition
                      in={match !== null}
                      key={location.key}
                      timeout={600}
                      unmountOnExit
                    >
                      <StatsPage />
                    </CSSTransition>
                  )}
                </Route>
                <Route exact strict path="/:slug" key={location.key}>
                  {({ match }) => (
                    <CSSTransition
                      in={match !== null}
                      key={location.key}
                      timeout={600}
                      unmountOnExit={false}
                    >
                      <ChallengePage />
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
                      <LandingPageV2 />
                    </CSSTransition>
                  )}
                </Route>
              </Switch>
            </TransitionGroup>
          )}
        />
      </PeerProvider>
    </SocketProvider>
  );
};
