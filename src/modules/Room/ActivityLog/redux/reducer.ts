import { createReducer } from 'deox';
import { GenericStateSlice } from 'src/redux/types';
import { addNotificationAction, clearLogAction, resolveOfferNotificationAction } from './actions';
import { Notification, OfferNotification } from 'src/modules/Room/ActivityLog/types';

export type State = {
  currentRoom: {
    history: Record<Notification['id'], Notification>;
    pending?: OfferNotification;
  };
};

export const initialState: State = {
  currentRoom: {
    history: {},
  },
};

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(addNotificationAction, (state, { payload }) => {
    if (payload.notification.type === 'offer' && payload.notification.status === 'pending') {
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          pending: payload.notification,
        },
      };
    }

    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        history: {
          ...state.currentRoom.history,
          [payload.notification.id]: payload.notification,
        },
      },
    };
  }),
  handleAction(resolveOfferNotificationAction, (state, { payload }) => {
    if (state.currentRoom.pending && state.currentRoom.pending.id === payload.notificationId) {
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          history: {
            ...state.currentRoom.history,
            [payload.notificationId]: {
              ...state.currentRoom.pending,
              status: payload.status,
            },
          },
          pending: undefined,
        },
      };
    }

    return state;
  }),

  handleAction(clearLogAction, () => {
    return {
      currentRoom: {
        history: {},
        pending: undefined,
      },
    };
  }),
]);

export const stateSliceByKey = {
  roomActivityLog: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
