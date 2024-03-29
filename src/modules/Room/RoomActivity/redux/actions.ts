import { createAction } from 'deox';
import { resolve } from 'dns';
import { AnalysisRecord, GameRecord } from 'chessroulette-io';
import { Game, WarGame } from 'src/modules/Games';
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

export const updateJoinedWarGameAction = createAction(
  'UpdateJoinedWarGame',
  (resolve) => (p: WarGame) => resolve(p)
)

export const updateCurrentAnalysisAction = createAction(
  'UpdateCurrentAnalysisAction',
  (resolve) => (p: AnalysisRecord) => resolve(p),
);

export const updateRelayGameAction = createAction(
  'UpdateRelayGameAction',
  (resolve) => (p: Game) => resolve(p) 
)
