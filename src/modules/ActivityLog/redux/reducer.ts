import { createReducer } from 'deox';
import { GenericStateSlice } from 'src/redux/types';
import { addNotificationAction, updateOfferNotificationAction, clearLogAction } from './actions';
import { Notification } from 'src/modules/ActivityLog/types';
import { removeMeAction, removeRoomAction } from 'src/providers/PeerProvider/redux/actions';

export type State = {
  currentRoom: Record<Notification['id'], Notification>;
};

export const initialState: State = {
  currentRoom: {},
};

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(addNotificationAction, (state, { payload }) => {
    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        [payload.notification.id]: payload.notification,
      },
    };
  }),
  handleAction(updateOfferNotificationAction, (state, { payload }) => {
    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        [payload.notificationId]: {
          ...state.currentRoom[payload.notificationId],
          status: payload.status,
        },
      },
    };
  }),

  handleAction([removeMeAction, removeRoomAction, clearLogAction], () => {
    return {
      currentRoom: {},
    };
  }),
]);

export const stateSliceByKey = {
  activityLog: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
