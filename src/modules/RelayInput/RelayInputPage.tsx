import { ChessMove, RelayedGameInfoRecord } from 'dstnd-io';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { usePeerState, usePeerStateClient } from 'src/providers/PeerProvider';
import { effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { console } from 'window-or-global';
import { getCurrentlyStreamingRelayedGames } from '../BroadcastPage/resources';
import { ChessBoard } from '../Games/Chess/components/ChessBoard';
import { DesktopRoomLayout } from '../Room/Layouts';
import { GenericLayoutDesktopRoomConsumer } from '../Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';

type Props = {};

const LAYOUT_RATIOS = {
  leftSide: 1.2,
  mainArea: 1,
  rightSide: 2.1,
};

export const RelayInputPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerClient = usePeerStateClient();
  const [relayGames, setRelayGames] = useState<RelayedGameInfoRecord[]>([]);

  const [unsubmittedMove, setUnsubmittedMove] = useState<ChessMove>();
  const submitMove = useCallback(() => {
    // send it to server
    setUnsubmittedMove(undefined);
  }, [unsubmittedMove]);

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames().map((relayGames) => {
      setRelayGames(relayGames);
    });
  }

  useEffect(() => {
    fetchLiveGames();
  }, [])

  useEffect(() => {
    const unsubscribe = peerClient.onMessage((msg) => {
      if (msg.kind === 'relayGameUpdateList') {
        fetchLiveGames();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [peerClient]);

  // useEffect(() => {
  //   if (peerState.status === 'open') {
  //     const unsubscribers = [
  //       peerState.client.onMessage((payload) => {
  //         if (payload.kind === 'relayGameUpdateList') {
  //           fetchLiveGames();
  //         }
  //       }),
  //     ];

  //     return () => {
  //       unsubscribers.forEach((unsubscribe) => unsubscribe());
  //     };
  //   }
  // }, [peerState.status]);

  return (
    <DesktopRoomLayout
      className={cls.container}
      ratios={LAYOUT_RATIOS}
      topHeight={80}
      bottomHeight={80}
      renderActivityComponent={(d) => (
        <div style={{}}>
          <ChessBoard
            size={d.main.width}
            id="1"
            pgn=""
            type="free"
            canInteract
            onMove={(m) => {
              setUnsubmittedMove(m.move);
            }}
            playableColor="black"
          />
          <Button label="Submit" onClick={submitMove} disabled={!unsubmittedMove} />
        </div>
      )}
      renderBottomComponent={() => null}
      renderRightSideComponent={() => (
        <div>
          {relayGames.map((relayGame) => (
            <div
              className={cls.gameContainer}
              onClick={() => {
                // setSelectedRelayId(relayGame.id);
                // setShowWizard(true);
              }}
            >
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
      )}
      renderTopComponent={() => null}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacers.small,
    ...effects.softBorderRadius,
    '&:hover' : {
      // backgroundColor: them.colors.primary,
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
});
