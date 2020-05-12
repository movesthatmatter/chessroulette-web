/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { SocketProvider } from 'src/components/SocketProvider';
import { action } from '@storybook/addon-actions';
import { AVStreaming } from 'src/services/AVStreaming';
import { RoomStatsRecord } from 'dstnd-io';
import { GameRoomContainer } from './GameRoomContainer';
import { GameRoom } from './GameRoom';
import { ChessPlayers, ChessGameState } from '../Games/Chess';

export default {
  component: GameRoomContainer,
  title: 'Modules/GameRoom/GameRoom',
};

const myId = 1;

const peers = {
  1: {
    id: '1',
    name: 'Broasca',
  },
  2: {
    id: '2',
    name: 'Piper',
  },
  // 3: {
  //   id: '3',
  //   name: 'Jartica',
  // },
  // 4: {
  //   id: '4',
  //   name: 'Teleenciclopedia',
  // },
  // 5: {
  //   id: '5',
  //   name: 'Samurai',
  // },
  // 6: {
  //   id: '6',
  //   name: 'Lebada',
  // },
} as const;

const room: RoomStatsRecord = {
  id: '0',
  name: 'Valencia',
  type: 'public',
  peersCount: Object.keys(peers).length,
  peers,
} as const;

const getPeerConnections = (localStream: MediaStream) =>
  Object.values(peers).reduce(
    (res, peer) => ({
      ...res,
      [peer.id]: {
        peerId: peer.id,
        channels: {
          data: { on: true },
          streaming: {
            on: true,
            type: 'audio-video',
            // stream: new MediaStream(),
            stream: localStream,
          },
        },
      } as const,
    }),
    {},
  );

export const publicRoom = () =>
  React.createElement(() => {
    const [localStream, setLocalStream] = useState<MediaStream | undefined>();

    useEffect(() => {
      const client = new AVStreaming();

      (async () => {
        setLocalStream(await client.start({ audio: false, video: true }));
      })();

      return () => {
        client.stop();
      };
    }, []);

    if (!localStream) {
      return null;
    }

    return (
      <SocketProvider>
        <GameRoom
          me={peers[myId]}
          room={room}
          peerConnections={getPeerConnections(localStream)}
          onNewGame={action('on new game')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={action('on game state update')}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
          localStream={undefined}
          playersById={undefined}
          currentGame={undefined}
          chatHistory={[]}
        />
      </SocketProvider>
    );
  });

const players = {
  white: {
    color: 'white',
    id: peers[1].id,
    name: peers[1].name,
  } as const,
  black: {
    color: 'black',
    id: peers[2].id,
    name: peers[2].name,
  } as const,
};

const elapsedTime = {
  white: 0,
  black: 0,
};

export const roomWithPlayers = () =>
  React.createElement(() => {
    const [localStream, setLocalStream] = useState<MediaStream | undefined>();
    const [currentGame, setCurrentGame] = useState<ChessGameState>({
      players,
      pgn: '',
      timeLeft: {
        white: 10 * 60 * 1000,
        black: 10 * 60 * 1000,
      },
      lastMoved: 'black',
    });

    useEffect(() => {
      const client = new AVStreaming();

      (async () => {
        setLocalStream(await client.start({ audio: false, video: true }));
      })();

      return () => {
        client.stop();
      };
    }, []);

    if (!localStream) {
      return null;
    }

    return (
      <SocketProvider>
        <GameRoom
          me={peers[myId]}
          room={room}
          peerConnections={getPeerConnections(localStream)}
          onNewGame={action('on new game')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={(nextGameState) => {
            console.log('current game', currentGame);
            console.log('next game state', nextGameState);
            console.log('current times', currentGame?.timeLeft);
            console.log('next times', nextGameState?.timeLeft);
            setCurrentGame(nextGameState);
          }}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
          localStream={localStream}
          playersById={{
            [players.white.id]: players.white,
            [players.black.id]: players.black,
          }}
          currentGame={currentGame}
          chatHistory={[]}
        />
      </SocketProvider>
    );
  });

export const waitingForPlayer = () =>
  React.createElement(() => {
    const [localStream, setLocalStream] = useState<MediaStream | undefined>();

    useEffect(() => {
      const client = new AVStreaming();

      (async () => {
        setLocalStream(await client.start({ audio: false, video: true }));
      })();

      return () => {
        client.stop();
      };
    }, []);

    if (!localStream) {
      return null;
    }

    return (
      <SocketProvider>
        <GameRoom
          me={peers[myId]}
          room={room}
          peerConnections={getPeerConnections(localStream)}
          onNewGame={action('on new game')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={action('on game state update')}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
          localStream={localStream}
          playersById={undefined}
          currentGame={undefined}
          chatHistory={[]}
        />
      </SocketProvider>
    );
  });
