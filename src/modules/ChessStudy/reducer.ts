import { createReducer, createAction } from 'deox';
import { ShortMove } from 'chess.js';
import { StudyStateRecord } from './records';
import { getStartingPgn, getGameAfterMove, getStartingFen } from '../Games/Chess/lib/util';

export const moveAction = createAction('move', (resolve) => (p: ShortMove) => resolve(p));
export const updateAction = createAction('update', (resolve) => (p: StudyStateRecord) => resolve(p));

export const initialState: StudyStateRecord = {
  pgn: getStartingPgn(),
  fen: getStartingFen(),
  history: [],
};

export const reducer = createReducer(initialState, (handleAction) => ([
  handleAction(moveAction, (state, { payload }) => getGameAfterMove(payload, state.pgn)
    .map((game) => ({
      ...state,
      pgn: game.pgn(),
      fen: game.fen(),
      history: game.history({ verbose: true }),
    }) as StudyStateRecord)
    .mapErr(() => state)
    // The unwrap doesn't work on error so I'm using val
    .val),
  handleAction(updateAction, (_, { payload }) => payload),
]));
