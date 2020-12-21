/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { ChessGameV2 } from './ChessGameV2';
import 'react-chessground/dist/styles/chessground.css';
import { ChessGameStateMocker } from 'src/mocks/records';
import { otherChessColor } from '../../util';

export default {
  component: ChessGameV2,
  title: 'Modules/Games/Chess/components/Chess Game V2',
};

const gameMocker = new ChessGameStateMocker();

export const fromStartingPosition = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.pending();

    return (
      <ChessGameV2
        game={game}
        // fen={fen}

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
        // fen={fen}

        homeColor="black"
        onMove={({ fen }) => {
        }}
      />
    );
  });

