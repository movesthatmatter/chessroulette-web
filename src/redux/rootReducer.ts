import { combineReducers } from 'redux';
import { stateSliceByKey as onboarding } from 'src/services/Authentication';
import { stateSliceByKey as chessStudy } from 'src/modules/ChessStudy/reducer';

const allModuleReducers = {
  ...onboarding,
  ...chessStudy,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
