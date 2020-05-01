import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerStream } from 'src/services/peer2peer/types';
import { AVStream } from 'src/components/AVStream';
import { ChatBox } from 'src/components/ChatBox';
import { noop } from 'src/lib/util';
import { PeerMessage } from 'src/services/peer2peer/records/MessagingPayload';
import { ChessGame, ChessPlayers, ChessGameFen } from '../Games/Chess';

type Props = {
  me: string;
  peers: string[];
  currentGame?: {
    players: ChessPlayers; // generalize it
    fen?: ChessGameFen;
  };
  chatHistory?: PeerMessage[];
  onNewChatMessage?: (msg: string) => void;
  onGameStateUpdate?: (nextState: ChessGameFen) => void;
  localStream?: MediaStream;
  remoteStreams?: PeerStream[];
  onNewGame?: (peers: string[]) => void;
}

const fakePlayers: ChessPlayers = {
  white: {
    name: 'Unknown',
    color: 'white',
  },
  black: {
    name: 'Unknown',
    color: 'black',
  },
};

export const GameRoom: React.FC<Props> = ({
  me,
  onNewGame = noop,
  onNewChatMessage = noop,
  onGameStateUpdate = noop,
  chatHistory = [],
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.peersContainer}>
        <div>{`Me: ${me}`}</div>
        {props.peers.filter((p) => p !== me).map((peer) => (
          <div key={peer}>
            {peer}
            {/* {props.currentGame} */}
            {/* <button
              onClick={() => onNewGame([me, peer])}
              type="button"
            >
              {`Play ${peer}`} */}
            {/* </button> */}
          </div>
        ))}
      </div>
      <div className={cls.avStreams}>

        {props.remoteStreams?.map(({ peerId, stream }) => (
          <div key={peerId}>
            <div className={cls.avStreamContainer}>
              <span>{peerId}</span>
              <AVStream
                stream={stream}
                autoPlay
                muted
                // muted={false}
                className={cls.avStream}
              />
              <button
                type="button"
                onClick={() => onNewGame([me, peerId])}
              >
                Challenge
                {' '}
                {peerId}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={cls.gameWrapper}>
        <ChessGame
          players={props.currentGame?.players || fakePlayers}
          fen={props.currentGame?.fen}
          homeColor="white"
          onMove={(nextFen) => {
            if (props.currentGame) {
              onGameStateUpdate(nextFen);
            }
          }}
        />
      </div>
      <div className={cls.chatBox}>
        <ChatBox
          messages={chatHistory}
          me={me}
          onSend={onNewChatMessage}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  avStreams: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.5,
    paddingRight: '20px',
    // maxWidth: '300px',
  },
  peersContainer: {

  },
  avStreamContainer: {
    display: 'flex',
    flexDirection: 'column',
    // padding: 20,
  },
  avStream: {
    width: '100%',
  },
  gameWrapper: {
    flex: 1,
  },
  chatBox: {
    flex: 0.5,
  },
});
