import React from 'react';
import { RoomPlayActivityWithGame } from 'src/modules/RoomV3/RoomActivity/activities/PlayActivity';
import { GameStateDialogContext } from './GameStateDialogContext';
// import { RoomPlayActivityWithGame } from 'src/modules/Room/Activities/PlayActivity';
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
