import React from 'react';
import { GameStateDialogContext } from './GameStateDialogContext';
import { RoomPlayActivityWithGame } from 'src/modules/Room/Activities/PlayActivity';

type Props = {
  isMobile: boolean;
  activity: RoomPlayActivityWithGame;
};

export const GameStateDialogProvider: React.FC<Props> = ({ children, ...contextProps }) => {
  return (
    <GameStateDialogContext.Provider value={contextProps}>
      {children}
    </GameStateDialogContext.Provider>
  );
};
