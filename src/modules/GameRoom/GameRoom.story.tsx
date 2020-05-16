/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { SocketProvider } from 'src/components/SocketProvider';
import { action } from '@storybook/addon-actions';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerRecordMock } from 'src/mocks/records';
import { range } from 'src/lib/util';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { GameRoomContainer } from './GameRoomContainer';
import { GameRoom } from './GameRoom';
import { ChessGameState, reduceChessGame } from '../Games/Chess';
import { GamePlayersBySide } from '../Games/Chess/chessGameStateReducer';

export default {
  component: GameRoomContainer,
  title: 'Modules/GameRoom/GameRoom',
};

const roomMocker = new RoomMocker();
const peerMocker = new PeerMocker();

const roomWithNoConnectionsPeers = range(4).map(() => peerMocker.record());
const roomWithNoConnections = roomMocker.withProps({
  peers: roomWithNoConnectionsPeers.reduce((accum, peer) => ({
    ...accum,
    [peer.id]: peer,
  }), {}),
});

export const publicRoom = () => (
  <SocketProvider>
    <WithLocalStream render={() => (
      <GameRoom
        me={roomWithNoConnections.me}
        room={roomWithNoConnections}
        startStreaming={action('start streaming')}
        onChallengeOffer={action('on challenge offered')}
        onChallengeAccepted={action('on challenge accepted')}
        onChallengeRefused={action('on challenge refused')}
        onChallengeCancelled={action('on challenge cancelled')}
        onGameStateUpdate={action('on game state update')}
        stopStreaming={action('stop streaming')}
        broadcastMessage={action('broadcast messsage')}
        currentGame={undefined}
        chatHistory={[]}
      />
    )}
    />
  </SocketProvider>
);

const peerMock = new PeerRecordMock();
const playersBySide: GamePlayersBySide = {
  home: peerMock.withProps({ id: roomWithNoConnections.me.id }),
  away: peerMock.withProps({ id: roomWithNoConnectionsPeers[0].id }),
};

export const roomWithPlayers = () =>
  React.createElement(() => {
    const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
      playersBySide,
      homeColor: 'white',
      timeLimit: 'blitz',
    }));

    return (
      <SocketProvider>
        <GameRoom
          me={roomWithNoConnections.me}
          room={roomWithNoConnections}
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
          me={roomWithNoConnections.me}
          room={roomWithNoConnections}
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

export const roomWithPlayersAndSpectators = () =>
  React.createElement(() => {
    const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
      playersBySide: {
        ...playersBySide,
        away: roomWithNoConnectionsPeers[0],
      },
      homeColor: 'white',
      timeLimit: 'rapid',
    }));

    return (
      <SocketProvider>
        <GameRoom
          me={roomWithNoConnections.me}
          room={roomWithNoConnections}
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

export const waitingForPlayer = () => (
  <SocketProvider>
    <GameRoom
      me={roomWithNoConnections.me}
      room={roomWithNoConnections}
      onChallengeOffer={action('on challenge offered')}
      onChallengeAccepted={action('on challenge accepted')}
      onChallengeRefused={action('on challenge refused')}
      onChallengeCancelled={action('on challenge cancelled')}
      startStreaming={action('start streaming')}
      onGameStateUpdate={action('on game state update')}
      stopStreaming={action('stop streaming')}
      broadcastMessage={action('broadcast messsage')}
      currentGame={undefined}
      chatHistory={[]}
    />
  </SocketProvider>
);
