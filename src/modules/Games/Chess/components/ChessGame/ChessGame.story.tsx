/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { action } from '@storybook/addon-actions';
import { ChessGame } from './ChessGame';
import { getNewChessGame, ChessInstance } from '../../lib/sdk';
import { ChessGameColor } from '../../records';
import { otherChessColor } from '../../util';

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

export const asWhite = () => (
  <ChessGame
    homeColor="white"
    playable
    pgn=""
  />
);
export const asBlack = () => (
  <ChessGame
    homeColor="black"
    playable
    pgn=""
  />
);
export const withLoggingOnMove = () => React.createElement(() => {
  const [fen, setFen] = useState<string>('');
  const [lastMoved, setLastMoved] = useState<ChessGameColor>('black');
  const myColor: ChessGameColor = 'white';

  return (
    <ChessGame
      homeColor="white"
      onMove={(newFen) => {
        setFen(newFen);
        setLastMoved((prev) => otherChessColor(prev));
        action('onMove')(newFen);
      }}
      pgn={fen}
      playable={myColor !== lastMoved}
      // fen={fen}
    />
  );
});

export const withSwitchingSide = () => React.createElement(() => {
  const [fen, setFen] = useState<string>('');
  const [lastMoved, setLastMoved] = useState<ChessGameColor>('black');
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

  return (
    <ChessGame
      homeColor={homeColor}
      onMove={(newFen) => {
        setFen(newFen);
        setLastMoved((prev) => otherChessColor(prev));
        setHomeColor((prev) => otherChessColor(prev));
        action('onMove')(newFen);
      }}
      pgn={fen}
      playable={homeColor !== lastMoved}
      // fen={fen}
    />
  );
});

export const withStartedGame = () => (
  <ChessGame
    homeColor="black"
    playable
    // fen="rnb1kbnr/ppp1pppp/3q4/3p4/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq - 2 3"
    pgn=""
  />
);

export const demoRandomGame = () =>
  React.createElement(() => {
    const [gameState, setGameState] = useState({ pgn: '' });

    useEffect(() => {
      const game = getNewChessGame();

      randomPlay(
        game,
        () => {
          setGameState((prevState) => ({
            ...prevState,
            pgn: game.pgn(),
          }));
        },
        3 * 1000,
      );
    }, []);

    return (
      <ChessGame
        homeColor="white"
        pgn={gameState.pgn}
        playable
      />
    );
  });
