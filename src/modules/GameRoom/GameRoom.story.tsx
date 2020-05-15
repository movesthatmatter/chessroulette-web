/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { SocketProvider } from 'src/components/SocketProvider';
import { action } from '@storybook/addon-actions';
import { AVStreaming } from 'src/services/AVStreaming';
import { RoomStatsRecord } from 'dstnd-io';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerRecordMock } from 'src/mocks/records';
import { range } from 'src/lib/util';
import { GameRoomContainer } from './GameRoomContainer';
import { GameRoom } from './GameRoom';
import { ChessGameState, reduceChessGame } from '../Games/Chess';
import { GamePlayersBySide } from '../Games/Chess/chessGameStateReducer';

export default {
  component: GameRoomContainer,
  title: 'Modules/GameRoom/GameRoom',
};

const peers = {
  1: {
    id: '1',
    name: 'Broasca',
  },
  2: {
    id: '2',
    name: 'Piper',
  },
} as const;

const myId = peers[1].id;

const room: RoomStatsRecord = {
  id: '0',
  name: 'Valencia',
  type: 'public',
  peersCount: Object.keys(peers).length,
  peers,
} as const;

const getPeerConnections = (localStream?: MediaStream, givenPeers = room.peers) =>
  Object.values(givenPeers).reduce(
    (res, peer) => ({
      ...res,
      [peer.id]: {
        peerId: peer.id,
        channels: {
          data: { on: true },
          streaming: {
            ...localStream ? {
              on: true,
              type: 'audio-video',
              stream: localStream,
            } : {
              on: false,
            },
          },
        },
      } as const,
    }),
    {},
  );

export const publicRoom = () => (
  <SocketProvider>
    <WithLocalStream render={() => (
      <GameRoom
        me={peers[myId]}
        room={room}
        peerConnections={getPeerConnections()}
        startStreaming={action('start streaming')}
        onChallengeOffer={action('on challenge offered')}
        onChallengeAccepted={action('on challenge accepted')}
        onChallengeRefused={action('on challenge refused')}
        onChallengeCancelled={action('on challenge cancelled')}
        onGameStateUpdate={action('on game state update')}
        stopStreaming={action('stop streaming')}
        broadcastMessage={action('broadcast messsage')}
        localStream={undefined}
        currentGame={undefined}
        chatHistory={[]}
      />
    )}
    />
  </SocketProvider>
);

const peerMock = new PeerRecordMock();
const playersBySide: GamePlayersBySide = {
  home: peerMock.withProps({ id: myId }),
  away: peerMock.withProps({ id: peers[2].id }),
};

export const roomWithPlayers = () =>
  React.createElement(() => {
    const [localStream, setLocalStream] = useState<MediaStream | undefined>();
    const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
      playersBySide,
      homeColor: 'white',
      timeLimit: 'blitz',
    }));

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
          onChallengeOffer={action('on challenge offered')}
          onChallengeAccepted={action('on challenge accepted')}
          onChallengeRefused={action('on challenge refused')}
          onChallengeCancelled={action('on challenge cancelled')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={(nextGameState) => {
            setCurrentGame(nextGameState);
          }}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
          localStream={localStream}
          currentGame={currentGame}
          chatHistory={[]}
        />
      </SocketProvider>
    );
  });

export const roomWithPlayersAndNoStream = () =>
  React.createElement(() => {
    const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
      playersBySide,
      homeColor: 'white',
      timeLimit: 'rapid',
    }));

    return (
      <SocketProvider>
        <GameRoom
          me={peers[myId]}
          room={room}
          peerConnections={getPeerConnections()}
          onChallengeOffer={action('on challenge offered')}
          onChallengeAccepted={action('on challenge accepted')}
          onChallengeRefused={action('on challenge refused')}
          onChallengeCancelled={action('on challenge cancelled')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={(nextGameState) => {
            setCurrentGame(nextGameState);
          }}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
          currentGame={currentGame}
          chatHistory={[]}
        />
      </SocketProvider>
    );
  });

const peerMocks = range(3).map(() => peerMock.record());
const peerMocksAsMap = peerMocks.reduce((prev, nextPeer) => ({
  ...prev,
  [`${nextPeer.id}`]: nextPeer,
}), {});

export const roomWithPlayersAndSpectators = () =>
  React.createElement(() => {
    const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
      playersBySide: {
        ...playersBySide,
        away: peerMocks[0],
      },
      homeColor: 'white',
      timeLimit: 'rapid',
    }));

    const peerConnections = getPeerConnections(undefined, peerMocksAsMap);

    return (
      <SocketProvider>
        <GameRoom
          me={peers[myId]}
          room={{
            ...room,
            peers: peerMocksAsMap,
          }}
          peerConnections={peerConnections}
          onChallengeOffer={action('on challenge offered')}
          onChallengeAccepted={action('on challenge accepted')}
          onChallengeRefused={action('on challenge refused')}
          onChallengeCancelled={action('on challenge cancelled')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={(nextGameState) => {
            setCurrentGame(nextGameState);
          }}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
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
          onChallengeOffer={action('on challenge offered')}
          onChallengeAccepted={action('on challenge accepted')}
          onChallengeRefused={action('on challenge refused')}
          onChallengeCancelled={action('on challenge cancelled')}
          startStreaming={action('start streaming')}
          onGameStateUpdate={action('on game state update')}
          stopStreaming={action('stop streaming')}
          broadcastMessage={action('broadcast messsage')}
          localStream={localStream}
          currentGame={undefined}
          chatHistory={[]}
        />
      </SocketProvider>
    );
  });
