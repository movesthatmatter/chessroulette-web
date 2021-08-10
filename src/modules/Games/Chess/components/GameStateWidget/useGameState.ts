import { useEffect, useState } from 'react';
import { PlayParticipants } from '../../..';
import { Game } from '../../../types';
import { getPlayersTimeLeft } from './util';

export const useGameTimesLeft = (game: Game, playParticipants: PlayParticipants) => {
  const [playersTimeLeft, setPlayersTimeLeft] = useState(
    getPlayersTimeLeft(game, playParticipants)
  );

  useEffect(() => {
    setPlayersTimeLeft(getPlayersTimeLeft(game, playParticipants));
  }, [game]);

  return playersTimeLeft;
};
