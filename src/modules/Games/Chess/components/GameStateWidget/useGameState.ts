import { ChessGameColor } from 'dstnd-io';
import { useEffect, useState } from 'react';
import { PlayParticipants } from '../../..';
import { Game } from '../../../types';
import { getPlayersTimeLeft, getPlayersTimeLeftFromGame } from './util';

export const useGameTimesLeft = (game: Game, homeColor: ChessGameColor, playParticipants?: PlayParticipants, ) => {
  const [playersTimeLeft, setPlayersTimeLeft] = useState(
    playParticipants 
    ? getPlayersTimeLeft(game, playParticipants)
    : getPlayersTimeLeftFromGame(game, homeColor)
  );

  useEffect(() => {
    setPlayersTimeLeft(
      playParticipants 
      ? getPlayersTimeLeft(game, playParticipants)
      : getPlayersTimeLeftFromGame(game, homeColor));
  }, [game]);

  return playersTimeLeft;
};
