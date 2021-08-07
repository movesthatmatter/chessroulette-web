import { createAction } from 'deox';
import { Game } from 'src/modules/Games';
import { BaseRoomActivity } from './types';

export const switchRoomActivityAction = createAction(
  'SwitchRoomActivity',
  (resolve) => (p: BaseRoomActivity) => resolve(p)
);

export const updateRoomActivityAction = createAction(
  'UpdateRoomActivity',
  (resolve) => (p: BaseRoomActivity) => resolve(p)
);

export const updateJoinedGameAction = createAction(
  'UpdateJoinedGame',
  (resolve) => (p: Game) => resolve(p),
);
