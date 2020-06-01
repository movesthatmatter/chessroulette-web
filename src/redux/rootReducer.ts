import { combineReducers } from 'redux';
import { stateSliceByKey as onboarding } from 'src/services/Authentication';

const allModuleReducers = {
  ...onboarding,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
