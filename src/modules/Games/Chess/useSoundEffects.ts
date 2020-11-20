import { ChessGameState } from 'dstnd-io';
import { useEffect, useRef } from 'react';
import { inCheck } from './lib';
import { sounds } from './assets/sounds';

const isDone = (game: ChessGameState) => game.state === 'finished' || game.state === 'stopped';

const isInCheck = (game: ChessGameState) => game.state === 'started' && inCheck(game.pgn);

export const useSoundEffects = (game: ChessGameState) => {
  const prevGame = useRef(game);

  useEffect(() => {
    // Only run it on mount
    if (game === prevGame.current) {
      if (isDone(game)) {
        sounds.checkMatedAudio.play();
      } else {
        sounds.gameStarted.play();
      }

      return;
    }

    if (!isDone(prevGame.current) && isDone(game)) {
      sounds.checkMatedAudio.play();
    }
    else if (!isInCheck(prevGame.current) && isInCheck(game)) {
      sounds.inCheckAudio.play();
    }
    // Runs when the game starts Again!
    else if (prevGame.current.state !== 'pending' && game.state === 'pending') {
      sounds.gameStarted.play();
    }
    else if (game.state === 'started' && game.pgn !== prevGame.current.pgn) {
      sounds.validMoveAudio.play();
    }

    prevGame.current = game;
  }, [game]);
};
