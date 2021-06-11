import React from 'react';
import { GameStateDialogContext } from './GameStateDialogContext';
import { Game } from '../../types';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { ChessPlayer } from 'dstnd-io';

type Props = {
  isMobile: boolean;
  room: RoomWithPlayActivity;
  game: Game;
  myPlayer?: ChessPlayer;
};

export const GameStateDialogProvider: React.FC<Props> = ({ children, ...contextProps }) => {
  return (
    <GameStateDialogContext.Provider value={contextProps}>
      {children}
    </GameStateDialogContext.Provider>
  );
};
