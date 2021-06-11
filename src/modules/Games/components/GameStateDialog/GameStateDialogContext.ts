import { createContext } from 'react';
import { Game } from '../../types';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { ChessPlayer } from 'dstnd-io';

export type GameStateDialogContextProps =
  | undefined
  | {
      isMobile: boolean;
      room: RoomWithPlayActivity;
      game: Game;
      myPlayer?: ChessPlayer;
    };

export const GameStateDialogContext = createContext<GameStateDialogContextProps>(undefined);
