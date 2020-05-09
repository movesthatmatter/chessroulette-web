import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerMessageEnvelope, PeerConnectionStatus } from 'src/services/peers';
import { PeerRecord } from 'dstnd-io';
import { FaceTime } from 'src/components/FaceTimeArea/FaceTime';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { ChatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import {
  ChessGame,
  ChessPlayers,
  ChessGameFen,
  ChessPlayer,
} from '../Games/Chess';

export type GameRoomProps = {
  me: PeerRecord;
  peerConnections: PeerConnectionStatus[];

  // Game
  playersByName: Record<string, ChessPlayer> | undefined;
  currentGame: {
    players: ChessPlayers; // generalize it
    fen?: ChessGameFen;
  } | undefined;
  onNewGame: (players: {
    challenger: string;
    challengee: string;
  }) => void;
  onGameStateUpdate: (nextState: ChessGameFen) => void;

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
  },
  black: {
    name: 'Unknown',
    color: 'black',
  },
};

export const GameRoom: React.FC<GameRoomProps> = ({
  me,
  peerConnections,
  playersByName,
  ...props
}) => {
  const cls = useStyles();

  return (
    <>
      <div>{`Me: ${me.name}`}</div>
      {!props.localStream ? (
        <button
          type="button"
          onClick={props.startStreaming}
        >
          Go Live
        </button>
      ) : (
        <>
          <FaceTime
            // This should come straight from localStreamClient
            streamConfig={{
              on: true,
              stream: props.localStream,
              type: 'audio-video',
            }}
          />
          <button
            type="button"
            onClick={props.stopStreaming}
          >
            Stop
          </button>
        </>
      )}
      <div className={cls.container}>
        <div className={cls.leftSide}>

          {peerConnections.map((pc) => (
            <div key={pc.peerId}>
              <FaceTime
                streamConfig={pc.channels.streaming}
              />
              {!props.currentGame && (
                <button
                  type="button"
                  onClick={() => props.onNewGame({
                    challengee: pc.peerId,
                    challenger: me.id,
                  })}
                >
                  {`Challenge ${pc.peerId}`}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className={cls.middleSide}>
          <ChessGame
            players={props.currentGame?.players || unknownPlayers}
            fen={props.currentGame?.fen}
            homeColor={
              (playersByName
                && playersByName[me.id]
                && playersByName[me.id].color)
              || 'white'
            }
            playable={!!(playersByName && !!playersByName[me.id])}
            onMove={(nextFen) => {
              if (props.currentGame) {
                props.onGameStateUpdate(nextFen);
              }
            }}
          />
        </div>
        <div className={cls.rightSide}>
          <ChatBoxContainer
            me={me}
            broadcastMessage={(...args) => {
              console.log('BROADCASTING MESSAGE');
              props.broadcastMessage(...args);
            }}
            chatHistory={props.chatHistory}
          />
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.5,
    paddingRight: '20px',
  },
  middleSide: {
    flex: 1,
  },
  rightSide: {
    flex: 0.5,
  },
  challengeButton: {
    padding: '10px',
    backgroundColor: 'rgb(8, 209, 131)',
  },
  peersContainer: {},
  avStreamContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  avStream: {
    width: '100%',
  },
  myAvStream: {
    width: '50%',
    '&:first-child': {
      width: '100%',
    },
  },
});
