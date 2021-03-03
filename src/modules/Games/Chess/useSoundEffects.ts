import { useEffect, useRef } from 'react';
import { inCheck } from './lib';
import objectEquals from 'object-equals';
import { Howl, HowlOptions } from 'howler';
import soundFxM4A from './assets/sounds/gameSoundsFX.m4a';
import soundFxOGG from './assets/sounds/gameSoundsFX.ogg';
import soundSpriteJSON from './assets/sounds/gameSoundsFX.json';
import { Game } from '../types';

const isDone = (game: Game) => game.state === 'finished' || game.state === 'stopped';

const isInCheck = (game: Game) => game.state === 'started' && inCheck(game.pgn);

export const useSoundEffects = (game: Game) => {
  const prevGame = useRef(game);
  const howl = useRef<Howl>();

  useEffect(() => {
    howl.current = new Howl({
      src: [soundFxM4A, soundFxOGG],
      autoplay: false,
      loop: false,
      volume: 1,
      onend: function () {
        if (howl.current) {
          howl.current.mute(false);
        }
      },
      // preload: true,
      sprite: (soundSpriteJSON.sprite as unknown) as HowlOptions['sprite'],
    });
  }, []);

  useEffect(() => {
    if (!howl.current) {
      return;
    }

    // Only run this on mount
    if (game === prevGame.current) {
      if (isDone(game)) {
        howl.current.play('check_mated');
      } else {
        howl.current.play('game_started');
      }

      return;
    }

    if (!isDone(prevGame.current) && isDone(game)) {
      howl.current.play('check_mated');
    } else if (!isInCheck(prevGame.current) && isInCheck(game)) {
      howl.current.play('in_check');
    }
    // Runs when the game starts Again!
    else if (prevGame.current.state !== 'pending' && game.state === 'pending') {
      howl.current.play('game_started');
    }
    // on Move with Capture
    else if (prevGame.current.captured && !objectEquals(game.captured, prevGame.current.captured)) {
      howl.current.play('captured');
    }
    // on Regular Move
    else if (game.state === 'started' && game.pgn !== prevGame.current.pgn) {
      howl.current.play('valid_move');
    }

    prevGame.current = game;
  }, [game]);

  // This is need for potentially passing it to a Button
  //  since Safari Mobile only starts playing sounds on first User Interaction
  //  So it needs to be tricked somehow :)
  const initiateSoundHandler = useRef(() => {
    if (howl.current) {
      howl.current.mute(true);
      howl.current.play('game_started');

      // Set itself to noop after run once
      initiateSoundHandler.current = () => {};
    }
  });

  return () => {
    initiateSoundHandler.current();
  };
};
