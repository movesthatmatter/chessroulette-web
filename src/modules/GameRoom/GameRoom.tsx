import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerMessageEnvelope } from 'src/services/peers';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { ChatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import { PeerConnections } from 'src/components/PeersProvider';
import logo from 'src/assets/logo_black.svg';
import cx from 'classnames';
import { complement } from 'src/lib/util';
import { RoomInfoDisplay } from 'src/components/RoomInfoDisplay';
import {
  ChessGame,
  ChessPlayers,
  ChessPlayer,
  ChessGameState,
} from '../Games/Chess';
import { PlayerBox } from './components/PlayerBox/PlayerBox';


export type GameRoomProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  peerConnections: PeerConnections;

  // Game
  playersById: Record<string, ChessPlayer> | undefined;
  currentGame: ChessGameState;
  onNewGame: (players: { challengerId: string; challengeeId: string }) => void;
  onGameStateUpdate: (nextState: ChessGameState) => void;

  // Streaming
  startStreaming: () => void;
  stopStreaming: () => void;
  localStream: MediaStream | void;

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

const chessColors = ['white', 'black'] as const;

export const GameRoom: React.FC<GameRoomProps> = ({
  me,
  peerConnections,
  playersById,
  ...props
}) => {
  const cls = useStyles();

  const homeColor = (playersById && playersById[me.id] && playersById[me.id].color) || 'white';
  const awayColor = complement(homeColor, chessColors);
  const playable = !!(playersById && !!playersById[me.id]);

  const playerHomeId = props.currentGame
    ? props.currentGame.players[homeColor].id
    : me.id;
  const playerAwayId = props.currentGame
    ? props.currentGame.players[awayColor].id
    : null;
  const [lastMoveTimestamp, setLastMoveTimestamp] = useState(new Date().getTime());

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <img src={logo} alt="logo" className={cls.logo} />
        </div>
        <main className={cls.grid}>
          <aside className={cls.leftSide}>
            <div className={cls.playersContainer}>
              {props.currentGame && playerAwayId ? (
                <PlayerBox
                  className={cls.playerBox}
                  currentGame={props.currentGame}
                  player={props.currentGame.players[awayColor]}
                  mutunachiId={9}
                  side="away"
                  streamConfig={peerConnections[playerAwayId].channels.streaming}
                />
              ) : (
                <div className={cls.playerBox}>
                  game not started
                </div>
              )}
              <PlayerBox
                className={cls.playerBox}
                currentGame={props.currentGame}
                player={props.currentGame?.players[homeColor] ?? {
                  ...me,
                  color: 'white',
                }}
                mutunachiId={3}
                side="home"
                streamConfig={
                  (playerHomeId === me.id)
                    ? peerConnections[playerHomeId].channels.streaming
                    : {
                      ...props.localStream ? {
                        on: true,
                        stream: props.localStream,
                        type: 'audio-video',
                      } : {
                        on: false,
                      },
                    }
                }
              />
            </div>
          </aside>
          <div className={cls.middleSide}>
            <ChessGame
              className={cls.gameContainer}
              players={props.currentGame?.players || unknownPlayers}
              pgn={props.currentGame?.pgn ?? ''}
              homeColor={homeColor}
              playable={playable}
              allowSinglePlayerPlay
              onMove={(next) => {
                if (props.currentGame) {
                  const currentMovedColor = props.currentGame.lastMoved === 'white' ? 'black' : 'white';
                  // get only seconds the smaller bit for now

                  const now = new Date().getTime();
                  const secondsSinceLastMoved = now - lastMoveTimestamp;

                  setLastMoveTimestamp(now);

                  props.onGameStateUpdate({
                    ...props.currentGame,
                    pgn: next,
                    lastMoved: currentMovedColor,
                    ...(props.currentGame.timeLeft && {
                      timeLeft: {
                        ...props.currentGame.timeLeft,
                        [currentMovedColor]:
                          props.currentGame.timeLeft[currentMovedColor]
                          - secondsSinceLastMoved,
                      },
                    }),
                  });
                }
              }}
            />
          </div>
          <aside className={cls.rightSide}>
            <RoomInfoDisplay
              me={me}
              localStream={props.localStream as MediaStream}
              room={props.room}
              peerConnections={peerConnections}
              players={playersById}
              gamePlayable={playable}
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
    height: '100%',
    border: '1px solid #dedede',

    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  playerBox: {
    width: '100%',
    flex: 1,
    textAlign: 'center',
  },
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
