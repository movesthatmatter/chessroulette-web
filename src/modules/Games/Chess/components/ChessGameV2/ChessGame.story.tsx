/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChessGameV2 } from './ChessGameV2';
import 'react-chessground/dist/styles/chessground.css';
import { GameMocker } from 'src/mocks/records/GameMocker';

export default {
  component: ChessGameV2,
  title: 'Modules/Games/Chess/components/Chess Game V2',
};

const gameMocker = new GameMocker();

export const fromStartingPosition = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.pending();

    return (
      <ChessGameV2
        game={game}
        homeColor="black"
        onMove={({ fen }) => {
        }}
      />
    );
  });


export const withGameStarted = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.started();

    return (
      <ChessGameV2
        game={game}
        size={400}
        homeColor="black"
        onMove={({ fen }) => {
        }}
      />
    );
  });

