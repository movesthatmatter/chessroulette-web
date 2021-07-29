import { createContext } from 'react';
import { RoomPlayActivityWithGame } from 'src/modules/Room/Activities/PlayActivity';

export type GameStateDialogContextProps =
  | undefined
  | {
      isMobile: boolean;
      activity: RoomPlayActivityWithGame;
    };

export const GameStateDialogContext = createContext<GameStateDialogContextProps>(undefined);
