import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerMessageEnvelope } from 'src/services/peers';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { ChatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import { PeerConnections } from 'src/components/PeersProvider';
import logo from 'src/assets/logo_black.svg';
import cx from 'classnames';
import { RoomInfoDisplay } from 'src/components/RoomInfoDisplay';
import {
  ChessGame,
  ChessPlayers,
  ChessPlayer,
  ChessGameState,
  reduceChessGame,
} from '../Games/Chess';
import { PlayerBox } from './components/PlayerBox/PlayerBox';
import { otherChessColor } from '../Games/Chess/util';

export type GameRoomProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  peerConnections: PeerConnections;

  // Game
  // playersById: Record<string, ChessPlayer>;
  currentGame: ChessGameState | undefined;
  onNewGame: (players: { challengerId: string; challengeeId: string }) => void;
  onGameStateUpdate: (nextState: ChessGameState) => void;

  // Streaming
  startStreaming: () => void;
  stopStreaming: () => void;
  localStream?: MediaStream;

  // Chat
  // The GameRoom shouldn't have to handle the state and know the intricacies
  //  of the chat system, instead it only passes the generic broadcast method further
  //  In the future, the ChatBoxContainer can access it directly from the PeersProvider
  //  via context
  chatHistory: ChatMessageRecord[];
  broadcastMessage: (msg: PeerMessageEnvelope['message']) => void;
};

const unknownPlayers: ChessPlayers = {
  white: {
    name: 'Unknown',
    color: 'white',
    id: '-1',
  },
  black: {
    name: 'Unknown',
    color: 'black',
    id: '-2',
  },
};

type ChessPlayersById = Record<string, ChessPlayer>;

// Memoize this to make it faster if needed
const getPlayersById = (gameState: ChessGameState | undefined): ChessPlayersById => {
  if (!gameState) {
    return {};
  }

  return {
    [gameState.players.white.id]: gameState.players.white,
    [gameState.players.black.id]: gameState.players.black,
  };
};

export const GameRoom: React.FC<GameRoomProps> = ({
  me,
  peerConnections,
  ...props
}) => {
  const cls = useStyles();
  const [lastMoveTime, setLastMoveTime] = useState<Date | undefined>();

  const playersById = props.currentGame
    ? getPlayersById(props.currentGame)
    // If there is no game in progress set me as the initial player
    : {
      [me.id]: {
        id: me.id,
        name: me.name,
        color: 'white',
      } as const,
    };

  const homeColor = (playersById[me.id] && playersById[me.id].color) || 'white';
  const awayColor = otherChessColor(homeColor);
  const playable = !!playersById[me.id];

  const playerHomeId = props.currentGame
    ? props.currentGame.players[homeColor].id
    : me.id;
  const playerAwayId = props.currentGame
    ? props.currentGame.players[awayColor].id
    : null;

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <img src={logo} alt="logo" className={cls.logo} />
        </div>
        <main className={cls.grid}>
          <aside className={cx(cls.leftSide, cls.playersContainer)}>
            {props.currentGame && playerAwayId ? (
              <PlayerBox
                className={cx(cls.playerBox, cls.playerBoxAway)}
                currentGame={props.currentGame}
                onTimeFinished={() => {
                  if (
                    !props.currentGame
                    || props.currentGame.state === 'finished'
                    || props.currentGame.state === 'neverStarted'
                  ) {
                    return;
                  }
                  props.onGameStateUpdate(
                    reduceChessGame.timerFinished(props.currentGame, {
                      loser: awayColor,
                    }),
                  );
                }}
                player={props.currentGame.players[awayColor]}
                mutunachiId={9}
                side="away"
                streamConfig={peerConnections[playerAwayId].channels.streaming}
              />
            ) : (
              <div className={cx(cls.playerBox, cls.playerBoxAway)}>
                game not started
              </div>
            )}
            <PlayerBox
              className={cx(cls.playerBox, cls.playerBoxHome)}
              currentGame={props.currentGame}
              onTimeFinished={() => {
                if (
                  !props.currentGame
                  || props.currentGame.state === 'finished'
                  || props.currentGame.state === 'neverStarted'
                ) {
                  return;
                }

                props.onGameStateUpdate(
                  reduceChessGame.timerFinished(props.currentGame, {
                    loser: homeColor,
                  }),
                );
              }}
              player={
                props.currentGame?.players[homeColor] ?? {
                  ...me,
                  color: 'white',
                }
              }
              mutunachiId={3}
              side="home"
              streamConfig={
                playerHomeId !== me.id
                  ? peerConnections[playerHomeId].channels.streaming
                  : {
                    ...(props.localStream
                      ? {
                        on: true,
                        stream: props.localStream,
                        type: 'audio-video',
                      }
                      : {
                        on: false,
                      }),
                  }
              }
              // Mute it if it's my stream so it doesn't createa a howling effect
              muted={playerHomeId === me.id}
            />
          </aside>
          <div className={cls.middleSide}>
            <ChessGame
              className={cls.gameContainer}
              players={props.currentGame?.players || unknownPlayers}
              pgn={props.currentGame?.pgn ?? ''}
              homeColor={homeColor}
              playable={playable}
              allowSinglePlayerPlay
              onMove={(nextPgn) => {
                // don't move unles the game is pending or started
                if (
                  !props.currentGame
                  || props.currentGame.state === 'finished'
                  || props.currentGame.state === 'neverStarted'
                ) {
                  return;
                }

                const now = new Date();

                const nextGame = reduceChessGame.move(props.currentGame, {
                  pgn: nextPgn,
                  msSinceLastMove: typeof lastMoveTime === 'undefined'
                    ? 0
                    : now.getTime() - lastMoveTime.getTime(),
                });

                setLastMoveTime(now);

                props.onGameStateUpdate(nextGame);
              }}
            />
          </div>
          <aside className={cls.rightSide}>
            <RoomInfoDisplay
              me={me}
              localStream={props.localStream as MediaStream}
              room={props.room}
              peerConnections={peerConnections}
              playersById={playersById}
              gameInProgress={!!props.currentGame && (props.currentGame.state === 'pending' || props.currentGame.state === 'started')}
            />
            <div>
              {props.room.type === 'private' && (
                <div>{`Invite Friends: ${props.room.code}`}</div>
              )}
            </div>
            <div className={cls.chatWrapper}>
              <ChatBoxContainer
                me={me}
                broadcastMessage={(...args) => {
                  props.broadcastMessage(...args);
                }}
                chatHistory={props.chatHistory}
              />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#efefef',
    position: 'relative',
  },
  paddingWrapper: {
    padding: '4px 16px',
    height: 'calc(100% - 16px)',
  },
  top: {
    paddingBottom: '16px',
  },
  logo: {
    width: '200px',
  },
  bottom: {},
  grid: {
    display: 'flex',
    flexDirection: 'row',
  },
  playersContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  playerBox: {
    width: '100%',
    flex: 1,
    textAlign: 'center',
  },
  playerBoxHome: {},
  playerBoxAway: {},
  playerStreamFallback: {
    textAlign: 'center',
  },
  playerCharacter: {
    width: '40p%',
    textAlign: 'center',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  middleSide: {
    border: '#ddd 1px solid',
    margin: '0 16px',
  },
  gameContainer: {},
  rightSide: {
    flex: 1,
  },
  chatWrapper: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    right: '16px',
  },
});
