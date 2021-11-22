import { Resources } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { noop, toRoomUrlPath } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { CustomTheme, effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { AsyncOk } from 'ts-async-results';
import { resources } from '../Room';
import { CreateRelayRoomWizard } from '../Room/wizards/CreateRelayRoomWizard';
import { NextBroadcasts } from './components/NextBroadcasts';
import { NoGames } from './components/NoGames';
import { RelayedGame } from './components/RelayedGame';
import { getCurrentlyStreamingRelayedGames } from './resources';

type Props = {};

export const BroadcastPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [relayGames, setRelayGames] = useState<Resources.AllRecords.Relay.RelayedGameInfoRecord[]>(
    []
  );
  const peerState = usePeerState();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRelayId, setSelectedRelayId] = useState<string>();
  const history = useHistory();

  useEffect(() => {
    if (peerState.status === 'open') {
      const unsubscribers = [
        peerState.client.onMessage((payload) => {
          if (payload.kind === 'relayGameUpdateList') {
            fetchLiveGames();
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [peerState.status]);

  useEffect(() => {
    fetchLiveGames();
  }, []);

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames().map((relayGames) => {
      setRelayGames(relayGames);
    });
  }

  return (
    <Page title="Broadcasts" name="Broadcasts" stretched>
      <div className={cls.container}>
        {relayGames.length === 0 && <NoGames />}
        {relayGames.map((relayGame) => (
          <RelayedGame
            relayGame={relayGame}
            showWizzard={() => setShowWizard(true)}
            selectRelayId={(id) => setSelectedRelayId(id)}
          />
        ))}
        <div className={cls.verticalSpacer}/>
        <NextBroadcasts/>
      </div>
      <Dialog
        visible={showWizard}
        content={
          <>
            {selectedRelayId && (
              <CreateRelayRoomWizard
                onFinished={() => {
                  if (peerState.status !== 'open') {
                    return AsyncOk.EMPTY;
                  }
                  return resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: 'private',
                      activityType: 'relay',
                      relayId: selectedRelayId,
                    })
                    .map((room) => {
                      setShowWizard(false);
                      Events.trackRoomCreated(room);
                      history.push(toRoomUrlPath(room));
                    });
                }}
              />
            )}
          </>
        }
        onClose={() => setShowWizard(false)}
      />
    </Page>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  verticalSpacer: {
    height: spacers.large
  }
}));
