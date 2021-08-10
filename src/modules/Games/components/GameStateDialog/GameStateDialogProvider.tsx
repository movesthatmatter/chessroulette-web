import React from 'react';
import { RoomPlayActivityWithGame } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { GameStateDialogContext } from './GameStateDialogContext';
import { DialogNotificationTypes } from './type';

type Props = {
  activity: RoomPlayActivityWithGame;
  dialogNotificationTypes: DialogNotificationTypes;
};

export const GameStateDialogProvider: React.FC<Props> = ({ children, ...contextProps }) => {
  return (
    <GameStateDialogContext.Provider value={contextProps}>
      {children}
    </GameStateDialogContext.Provider>
  );
};
