import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerStream } from 'src/services/peer2peer/types';
import { AVStream } from 'src/components/AVStream';
import { ChatBox } from 'src/components/ChatBox';
import { noop } from 'src/lib/util';
import { PeerMessage } from 'src/services/peer2peer/records/PeerMessagingPayload';
import cx from 'classnames';
import {
  ChessGame, ChessPlayers, ChessGameFen, ChessPlayer,
} from '../Games/Chess';

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
  onNewGame?: (peers: {
    from: string;
    to: string;
  }) => void;
}

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

type ChessPlayersByName = {
  [name: string]: ChessPlayer;
}

const chessPlayersByName = (players: ChessPlayers): ChessPlayersByName => ({
  [players.white.name]: players.white,
  [players.black.name]: players.black,
});

export const GameRoom: React.FC<Props> = ({
  me,
  onNewGame = noop,
  onNewChatMessage = noop,
  onGameStateUpdate = noop,
  chatHistory = [],
  ...props
}) => {
  const cls = useStyles();

  // const myColor = (props.currentGame?.players.white.name === me ? 'white' : 'black') ?? 'white';

  const [playersByName, setPlayersByName] = useState<ChessPlayersByName | void>(
    props.currentGame ? chessPlayersByName(props.currentGame.players) : undefined,
  );

  useEffect(() => {
    if (props.currentGame) {
      setPlayersByName(chessPlayersByName(props.currentGame.players));
    } else {
      setPlayersByName(undefined);
    }
  }, [props.currentGame?.players]);

  return (
    <>
      <div>{`Me: ${me}`}</div>
      {props.peers.filter((p) => p !== me).map((peer) => (
        <div key={peer}>
          {/* {peer} */}
          {/* {props.currentGame} */}
          {/* <button
              onClick={() => onNewGame([me, peer])}
              type="button"
            >
              {`Play ${peer}`} */}
          {/* </button> */}
        </div>
      ))}
      <div className={cls.container}>
        {/* <div className={cls.peersContainer}> */}
        <div className={cls.avStreams}>
          {props.remoteStreams?.map(({ peerId, stream }) => (
            <div key={peerId} className={cls.avStreamContainer}>
              <span>{peerId}</span>
              <AVStream
                stream={stream}
                autoPlay
                muted={false}
                // muted={false}
                className={cls.avStream}
              />
              {!props.currentGame && (
                <button
                  type="button"
                  className={cls.challengeButton}
                  onClick={() => onNewGame({
                    from: me,
                    to: peerId,
                  })}
                >
                  Challenge
                  {' '}
                  {peerId}
                </button>
              )}
            </div>
          ))}
          {props.localStream && (
            <AVStream
              stream={props.localStream}
              autoPlay
              muted
              className={cx([cls.avStream, cls.myAvStream])}
            />
          )}
        </div>
        <div className={cls.gameWrapper}>
          <ChessGame
            players={props.currentGame?.players || unknownPlayers}
            fen={props.currentGame?.fen}
            homeColor={(playersByName && playersByName[me] && playersByName[me].color) || 'white'}
            playable={!!(playersByName && !!playersByName[me])}
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
    </>
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
  },
  challengeButton: {
    padding: '10px',
    backgroundColor: 'rgb(8, 209, 131)',
  },
  peersContainer: {

  },
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
  gameWrapper: {
    flex: 1,
  },
  chatBox: {
    flex: 0.5,
  },
});
