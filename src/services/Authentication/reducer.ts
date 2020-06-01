import { UserRecord } from 'dstnd-io';
import { createReducer, createAction } from 'deox';
import { GenericStateSlice } from 'src/redux/types';
import { setUserAction, unsetUserAction } from './actions';

type State = {
  isAuthenticated: false;
} | {
  isAuthenticated: true;
  user: UserRecord;
}

const initialState = {
  isAuthenticated: false,
};

const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(setUserAction, (_, { payload }) => ({
    isAuthenticated: true,
    user: payload,
  })),
  handleAction(unsetUserAction, () => ({
    isAuthenticated: false,
  })),
]);

export const stateSliceByKey = {
  auth: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<
  typeof stateSliceByKey,
  typeof reducer
>
