import { createReducer, createAction } from 'deox';
import { persistReducer } from 'redux-persist';
import { GenericStateSlice } from 'src/redux/types';
import { SessionState } from './type';
import storageSession from 'redux-persist/lib/storage/session';

export const setSessionAction = createAction(
  'Set Session',
  (resolve) => (p: { key: string; value: unknown }) => resolve(p)
);

const initialState: SessionState = {};

const reducer = createReducer(initialState as SessionState, (handleAction) => [
  handleAction(setSessionAction, (prev, action) => {
    return { ...prev, [action.payload.key]: action.payload.value };
  }),
]);

const stateSliceByKeyWithoutPersist = {
  session: reducer,
};

// TODO: Persist it in session storage
export const stateSliceByKey = {
  session: persistReducer(
    {
      key: 'session',
      storage: storageSession,
    },
    reducer
  ),
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<
  typeof stateSliceByKeyWithoutPersist,
  typeof reducer
>;
