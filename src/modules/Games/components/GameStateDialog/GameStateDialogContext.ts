import { createContext } from 'react';
import { RoomPlayActivityWithGame } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { DialogNotificationTypes } from './type';

export type GameStateDialogContextProps =
  | undefined
  | {
      dialogNotificationTypes: DialogNotificationTypes;
      activity: RoomPlayActivityWithGame;
    };

export const GameStateDialogContext = createContext<GameStateDialogContextProps>(undefined);
