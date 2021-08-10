import { combineReducers } from 'redux';
import { GenericStateSlice } from 'src/redux/types';

import { stateSliceByKey as activity } from '../RoomActivity/redux/reducer';
import { stateSliceByKey as activityLog } from '../RoomActivityLog/redux/reducer';

const reducer = combineReducers({
  ...activity,
  ...activityLog,
});

export const stateSliceByKey = {
  room: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
