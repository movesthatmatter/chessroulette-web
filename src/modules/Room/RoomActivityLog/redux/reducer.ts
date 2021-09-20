import { createReducer } from 'deox';
import { GenericStateSlice } from 'src/redux/types';
import {
  addNotificationAction,
  clearLogAction,
  clearSpecificActivityLog,
  resolveOfferNotificationAction,
} from './actions';
import {
  ChallengeNotification,
  Notification,
  OfferNotification,
  RoomSpecificNotifications,
} from 'src/modules/Room/RoomActivityLog/types';
import { console } from 'window-or-global';

export type State = {
  currentRoom: {
    history: Record<Notification['id'], Notification>;
    pending?: OfferNotification | ChallengeNotification;
  };
};

export const initialState: State = {
  currentRoom: {
    history: {},
  },
};

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(addNotificationAction, (state, { payload }) => {
    if (
      (payload.notification.type === 'offer' || payload.notification.type === 'challenge') &&
      payload.notification.status === 'pending'
    ) {
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

  handleAction(clearSpecificActivityLog, (state, { payload }) => {
    console.log('CURRENT ROOM', state.currentRoom);
    const updatedHistory: Record<Notification['id'], Notification> = Object.keys(
      state.currentRoom.history
    ).reduce((acc, entry) => {
      if (state.currentRoom.history[entry].type === 'roomSpecific') {
        if (
          (state.currentRoom.history[entry] as RoomSpecificNotifications).activity ===
          payload.activity
        ) {
          return acc;
        }
      }
      return {
        ...acc,
        [entry]: state.currentRoom.history[entry],
      };
    }, {} as Record<Notification['id'], Notification>);
    console.log('updated history', updatedHistory);
    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        history: updatedHistory,
      },
    };
  }),
]);

export const stateSliceByKey = {
  roomActivityLog: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
