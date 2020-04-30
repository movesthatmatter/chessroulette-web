/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';
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

export const asWhite = () => <ChessGame myColor="white" />;
export const asBlack = () => <ChessGame myColor="black" />;
export const withLoggingOnMove = () => (
  <ChessGame myColor="black" onMove={action('onMove')} />
);
export const withStartedGame = () => (
  <ChessGame
    myColor="black"
    fen="rnb1kbnr/ppp1pppp/3q4/3p4/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq - 2 3"
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

    return <ChessGame myColor="white" fen={gameState.fen} />;
  });
