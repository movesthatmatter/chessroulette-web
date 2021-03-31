import { GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';
import { createReducer } from 'deox';
import { GenericStateSlice } from 'src/redux/types';
import { setUserAction, unsetUserAction, updateUserAction } from './actions';

type State = RegisteredUserRecord | GuestUserRecord | undefined;

const initialState: State = undefined;

const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction([setUserAction, updateUserAction], (_, { payload }) => payload.user),
  handleAction(unsetUserAction, () => undefined),
]);

export const stateSliceByKey = {
  user: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
