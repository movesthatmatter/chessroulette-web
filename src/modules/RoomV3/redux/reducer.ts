import { combineReducers } from 'redux';
import { GenericStateSlice } from 'src/redux/types';

import { stateSliceByKey as activity } from '../RoomActivity/redux/reducer';

const reducer = combineReducers({
  ...activity,
});

export const stateSliceByKey = {
  room: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
