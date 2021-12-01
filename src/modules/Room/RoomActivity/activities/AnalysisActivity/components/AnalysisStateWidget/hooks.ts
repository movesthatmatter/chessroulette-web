import { GameRecord } from 'dstnd-io';
import { DependencyList, useEffect, useState } from 'react';
import { getPlayersTimeLeftByColor } from 'src/modules/Games/Chess/components/GameStateWidget/util';

export const useGameTimesLeftByColorWithOptionalGame = (game?: GameRecord, deps: DependencyList = []) => {
  const [timeLeft, setTimeLeft] = useState(game ? getPlayersTimeLeftByColor(game) : undefined);

  useEffect(() => {
    if (!game) {
      return;
    }

    setTimeLeft(getPlayersTimeLeftByColor(game));
  }, [game, ...deps]);

  return timeLeft;
};
