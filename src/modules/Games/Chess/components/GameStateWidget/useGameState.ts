import { DependencyList, useEffect, useState } from 'react';
import { Game, PlayParticipants } from '../../../types';
import { getPlayersTimeLeft, getPlayersTimeLeftByColor } from './util';

export const useGameTimesLeft = (game: Game, playParticipants: PlayParticipants) => {
  const [playersTimeLeft, setPlayersTimeLeft] = useState(
    getPlayersTimeLeft(game, playParticipants)
  );

  useEffect(() => {
    setPlayersTimeLeft(getPlayersTimeLeft(game, playParticipants));
  }, [game]);

  return playersTimeLeft;
};

export const useGameTimesLeftByColor = (game: Game, deps: DependencyList = []) => {
  const [timeLeft, setTimeLeft] = useState(getPlayersTimeLeftByColor(game));

  useEffect(() => {
    setTimeLeft(getPlayersTimeLeftByColor(game));
  }, [game, ...deps]);

  return timeLeft;
};
