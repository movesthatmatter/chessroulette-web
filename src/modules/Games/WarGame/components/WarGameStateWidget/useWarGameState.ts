import { DependencyList, useEffect, useState } from 'react';
import { WarGame, WarGameParticipants } from 'src/modules/Games/types';
import { getPlayersTimeLeft, getPlayersTimeLeftByColor } from '../../utils';

export const useWarGameTimesLeft = (game: WarGame, participants: WarGameParticipants) => {
  const [playerstimeLeft, setPlayersTimeLeft] = useState(
    getPlayersTimeLeft(game, participants)
  )

  useEffect(() => {
    setPlayersTimeLeft(getPlayersTimeLeft(game, participants));
  },[game]);

  return playerstimeLeft;
}

export const useGameTimesLeftByColor = (game: WarGame, deps: DependencyList = []) => {
  const [timeLeft, setTimeLeft] = useState(getPlayersTimeLeftByColor(game));

  useEffect(() => {
    setTimeLeft(getPlayersTimeLeftByColor(game));
  }, [game, ...deps]);

  return timeLeft;
};
