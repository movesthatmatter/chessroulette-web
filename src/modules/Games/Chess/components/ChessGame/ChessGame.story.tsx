/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { ChessGame } from './ChessGame';
import { getNewChessGame, ChessInstance } from '../../lib/sdk';

const randomPlay = (
  chess: ChessInstance,
  onChange: (fen: string) => void = noop,
  speed = 1000,
) => {
  if (!chess.game_over()) {
    const moves = chess.moves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);

    onChange(chess.fen());

    setTimeout(() => randomPlay(chess, onChange), speed);
  }
};

export default {
  component: ChessGame,
  title: 'Modules/Games/Chess/components/Chess Game',
};

const mockPlayers = {
  white: {
    name: 'kasparov',
    color: 'white',
  },
  black: {
    name: 'Ficher',
    color: 'black',
  },
} as const;

export const asWhite = () => (
  <ChessGame homeColor="white" players={mockPlayers} />
);
export const asBlack = () => (
  <ChessGame homeColor="black" players={mockPlayers} />
);
export const withLoggingOnMove = () => React.createElement(() => {
  const [fen, setFen] = useState<string | undefined>();

  return (
    <ChessGame
      homeColor="white"
      onMove={(newFen) => {
        setFen(newFen);
        // action('onMove', newFen)();
      }}
      players={mockPlayers}
      allowSinglePlayerPlay
      fen={fen}
    />
  );
});

export const withStartedGame = () => (
  <ChessGame
    homeColor="black"
    fen="rnb1kbnr/ppp1pppp/3q4/3p4/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq - 2 3"
    players={mockPlayers}
  />
);

export const demoRandomGame = () =>
  React.createElement(() => {
    const [gameState, setGameState] = useState({ fen: '' });

    useEffect(() => {
      const game = getNewChessGame();

      randomPlay(
        game,
        () => {
          setGameState((prevState) => ({
            ...prevState,
            fen: game.fen(),
          }));
        },
        3 * 1000,
      );
    }, []);

    return (
      <ChessGame homeColor="white" fen={gameState.fen} players={mockPlayers} />
    );
  });
