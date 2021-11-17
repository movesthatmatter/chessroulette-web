import { RelayedGameInfoRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { noop, toRoomUrlPath } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { CustomTheme, effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { AsyncOk } from 'ts-async-results';
import { console } from 'window-or-global';
import { ChessBoard } from '../Games/Chess/components/ChessBoard';
import { resources } from '../Room';
import { CreateRelayRoomWizard } from '../Room/wizards/CreateRelayRoomWizard';
import { getCurrentlyStreamingRelayedGames } from './resources';

type Props = {};

export const BroadcastPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [relayGames, setRelayGames] = useState<RelayedGameInfoRecord[]>([]);
  const peerState = usePeerState();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRelayId, setSelectedRelayId] = useState<string>()
  const history = useHistory()

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
    <Page title="Broadcasts" name="Broadcasts">
      <div className={cls.container}>
        {relayGames.length === 0 && (
          <div>
            <Text>There are currently no live Games.</Text>
          </div>
        )}
        {relayGames.map((relayGame) => (
          <div className={cls.gameContainer} onClick={() => {
              setSelectedRelayId(relayGame.id);
              setShowWizard(true);
          }}>
            <div className={cls.playerInfo}>{relayGame.game.players[0].user.name}</div>
            <ChessBoard
              type="free"
              playable={false}
              pgn={relayGame.game.pgn}
              viewOnly
              playableColor={'white'}
              onMove={noop}
              id={relayGame.game.id}
              size={200}
            />
            <div className={cls.playerInfo}>{relayGame.game.players[1].user.name}</div>
          </div>
        ))}
      </div>
      <Dialog visible={showWizard}
        content={
          <>
          {selectedRelayId && <CreateRelayRoomWizard
            onFinished={() => {
              if (peerState.status !== 'open'){
                return AsyncOk.EMPTY;
              }
              return resources.createRoom({
                userId: peerState.me.id,
                type: 'private',
                activityType: 'relay',
                relayId: selectedRelayId
              })
              .map(room => {
                setShowWizard(false);
                Events.trackRoomCreated(room);
                history.push(toRoomUrlPath(room));
              })
            }}
            />}
          </>
        }
        onClose={() => setShowWizard(false)}
        />
    </Page>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacers.small,
    ...effects.softBorderRadius,
    '&:hover' : {
      backgroundColor: theme.colors.primary,
      cursor: 'pointer'
    }
  },
  playerInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'left',
    marginTop: '5px',
    marginBottom: '5px',
  },
}));
