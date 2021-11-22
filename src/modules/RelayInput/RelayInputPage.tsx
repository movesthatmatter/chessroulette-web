import { ChessMove, gameRecord, Resources } from 'dstnd-io';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { usePeerStateClient } from 'src/providers/PeerProvider';
import { effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { getCurrentlyStreamingRelayedGames } from '../BroadcastPage/resources';
import { Game } from '../Games';
import { ChessGame } from '../Games/Chess';
import { ChessBoard } from '../Games/Chess/components/ChessBoard';
import { gameRecordToGame } from '../Games/Chess/lib';
import { DesktopRoomLayout } from '../Room/Layouts';
import { createRelay } from './resource';

type Props = {};

const LAYOUT_RATIOS = {
  leftSide: 1.2,
  mainArea: 1,
  rightSide: 2.1,
};

export const RelayInputPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerClient = usePeerStateClient();
  const [relayGames, setRelayGames] = useState<Resources.AllRecords.Relay.RelayedGameInfoRecord[]>(
    []
  );

  const [currentRelay, setCurrentRelay] = useState<
    Resources.AllRecords.Relay.RelayedGameRecord & { game: Game }
  >();

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
  }, []);

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
          {currentRelay?.game && (
            <ChessGame
              size={d.main.width}
              game={currentRelay.game}
              onAddMove={() => {
                console.log('moved');
              }}
              canInteract
              turnColor={'white'}
            />
            // <ChessBoard
            //   size={d.main.width}
            //   id={currentRelay.game.id}
            //   pgn=""
            //   type="play"
            //   canInteract
            //   onMove={(m) => {
            //     setUnsubmittedMove(m.move);
            //   }}
            //   playableColor="black"
            // />
          )}

          <Button label="Submit" onClick={submitMove} disabled={!unsubmittedMove} />
          <Button
            label="Create Relay"
            onClick={() => {
              createRelay({
                relaySource: 'proxy',
                type: 'newGame',
                gameSpecs: {
                  timeLimit: 'rapid30',
                  preferredColor: 'white',
                },
                players: {
                  white: {
                    color: 'white',
                    user: {
                      id: 'Magnus',
                      isGuest: true,
                      firstName: 'Magnus',
                      lastName: 'Carlsen',
                      name: 'Magnus Carlsen',
                      avatarId: '1',
                    },
                  },
                  black: {
                    color: 'black',
                    user: {
                      id: 'Nepo',
                      isGuest: true,
                      firstName: 'Nepo',
                      lastName: 'Itch',
                      name: 'Nepo itch',
                      avatarId: '2',
                    },
                  },
                },
              }).map((r) => {
                setCurrentRelay({
                  ...r,
                  game: gameRecordToGame(r.game),
                });
              });
            }}
          />
        </div>
      )}
      renderBottomComponent={() => null}
      renderRightSideComponent={() => (
        <div>
          {relayGames.map((relayGame) => (
            <div
              className={cls.gameContainer}
              onClick={() => {
                createRelay({
                  relaySource: 'proxy',
                  type: 'existentGame',
                  gameId: relayGame.game.id,
                }).map((r) => {
                  setCurrentRelay({
                    ...r,
                    game: gameRecordToGame(r.game),
                  });
                });
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
    '&:hover': {
      // backgroundColor: them.colors.primary,
      cursor: 'pointer',
    },
  },
  playerInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'left',
    marginTop: '5px',
    marginBottom: '5px',
  },
});
