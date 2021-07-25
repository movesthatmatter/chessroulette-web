import { createAction } from 'deox';
import { Game } from 'src/modules/Games';
import { RoomActivity } from './types';

export const switchRoomActivityAction = createAction(
  'SwitchRoomActivity',
  (resolve) => (p: RoomActivity) => resolve(p)
);

export const updateRoomActivityAction = createAction(
  'UpdateRoomActivity',
  (resolve) => (p: RoomActivity) => resolve(p)
);

export const updateJoinedGameAction = createAction(
  'UpdateJoinedGame',
  (resolve) => (p: Game) => resolve(p),
);
