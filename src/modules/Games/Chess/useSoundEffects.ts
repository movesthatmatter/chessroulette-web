import { ChessGameState } from 'dstnd-io';
import { useEffect, useRef } from 'react';
import { inCheck } from './lib';
import objectEquals from 'object-equals';
import { Howl, HowlOptions } from 'howler';
import soundFxM4A from './assets/sounds/gameSoundsFX.m4a';
import soundFxOGG from './assets/sounds/gameSoundsFX.ogg';
import soundSpriteJSON from './assets/sounds/gameSoundsFX.json';

const isDone = (game: ChessGameState) => game.state === 'finished' || game.state === 'stopped';

const isInCheck = (game: ChessGameState) => game.state === 'started' && inCheck(game.pgn);

export const useSoundEffects = (game: ChessGameState) => {
  const prevGame = useRef(game);
  const howl = useRef(
    new Howl({
      src: [soundFxM4A, soundFxOGG],
      autoplay: false,
      loop: false,
      volume: 1,
      onend: function () {
        howl.mute(false);
      },
      preload: true,
      sprite: soundSpriteJSON.sprite as unknown as HowlOptions['sprite'],
    })
  ).current;

  useEffect(() => {
    // Only run this on mount
    if (game === prevGame.current) {
      if (isDone(game)) {
        howl.play('check_mated');
      } else {
        howl.play('game_started');
      }

      return;
    }

    if (!isDone(prevGame.current) && isDone(game)) {
      howl.play('check_mated');
    }
    else if (!isInCheck(prevGame.current) && isInCheck(game)) {
      howl.play('in_check');
    }
    // Runs when the game starts Again!
    else if (prevGame.current.state !== 'pending' && game.state === 'pending') {
      howl.play('game_started');
    }
    // on Move with Capture
    else if (prevGame.current.captured && !objectEquals(game.captured, prevGame.current.captured)) {
      howl.play('captured');
    }
    // on Regular Move
    else if (game.state === 'started' && game.pgn !== prevGame.current.pgn) {
      howl.play('valid_move');
    }

    prevGame.current = game;
  }, [game]);

  // This is need for potentially passing it to a Button
  //  since Safari Mobile only starts playing sounds on first User Interaction
  //  So it needs to be tricked somehow :)
  const initiateSoundHandler = useRef(() => {
    howl.mute(true);
    howl.play('game_started');

    // Set itself to noop the once run
    initiateSoundHandler.current = () => {};
  });

  return () => {
    initiateSoundHandler.current();
  };
};
