import { combineReducers } from 'redux';
import { stateSliceByKey as feedbackDialog } from 'src/components/FeedbackDialog/reducer';
import { GenericStateSlice } from 'src/redux/types';

const reducer = combineReducers({
  ...feedbackDialog,
});

export const stateSliceByKey = {
  session: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
