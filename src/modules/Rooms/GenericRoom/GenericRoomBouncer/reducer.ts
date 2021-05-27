import { createReducer, createAction } from 'deox';
import { RoomRecord } from 'dstnd-io';
import { GenericStateSlice } from 'src/redux/types';

export type State = null | {
  // Browser Support
  // By default is undefined. Only if checked and made sure it's unsupported
  //  does it become true! This way all the website works, until
  //  a place which needs to ensure browser support, checks it and fails!
  browserIsUnsupported: undefined | boolean;

  // Browser Camera/Mic Permissions
  permissionsRequestAgreed: undefined | boolean;
  permissionsGranted: undefined | boolean;

  // Room Permissions
  confirmedRoomJoin:
    | {
        status: boolean;
        roomSlug: RoomRecord['id'];
      }
    | {
        status: undefined;
      };

  // All
  ready: boolean;
};

export const initialState: State = null;

export const checkRoomAction = createAction(
  'CheckRoom',
  (resolve) => (p: { roomSlug: RoomRecord['slug'] }) => resolve(p)
);
export const agreePermissionsRequestAction = createAction('AgreePermissionsRequest');
export const grantPermissionsAction = createAction('GrantPermisssions');
export const refusePermissionsAction = createAction('RefusePermisssions');
export const refuseBrowserSuppport = createAction('RefuseBrowserSuppport');
export const confirmJoiningRoomAction = createAction(
  'ConfirmJoiningRoomAction',
  (resolve) => (p: { roomSlug: RoomRecord['slug'] }) => resolve(p)
);

const getReadyFlag = (state: Omit<NonNullable<State>, 'ready'>) => {
  return !!(
    state &&
    state.permissionsGranted &&
    state.confirmedRoomJoin &&
    state.confirmedRoomJoin.status &&
    state.browserIsUnsupported !== true
  );
};

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(checkRoomAction, (state, { payload }) => {
    // If the rooms are the same just return the prev state
    if (
      state &&
      state.confirmedRoomJoin &&
      state.confirmedRoomJoin.status &&
      state.confirmedRoomJoin.roomSlug === payload.roomSlug
    ) {
      return state;
    }

    const nextState: Omit<NonNullable<State>, 'ready'> = {
      // Default to true until a check called from
      // a specific place sets it to false!
      // TODO: Maybe move from here?
      browserIsUnsupported: state?.browserIsUnsupported,

      // Camera & Mic Permissions
      // If the Browser checks were already made for another room,
      //  there's no point to ask them again!
      // TODO: This should probably have an expiry limit of max 24h
      permissionsRequestAgreed: state?.permissionsRequestAgreed,
      permissionsGranted: state?.permissionsGranted,

      // Room Permissions
      // When the room changes the User has to explicityly join it at lease once!
      confirmedRoomJoin: {
        roomSlug: payload.roomSlug,
        status: false,
      },
    };

    return {
      ...nextState,

      // All
      ready: getReadyFlag(nextState),
    };
  }),

  handleAction(agreePermissionsRequestAction, (state) => {
    if (!state) {
      return state;
    }

    const nextState = {
      ...state,
      permissionsRequestAgreed: true,
    } as const;

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    };
  }),
  handleAction(refusePermissionsAction, (state) => {
    if (!state) {
      return state;
    }

    const nextState = {
      ...state,
      permissionsGranted: false,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    };
  }),
  handleAction(grantPermissionsAction, (state) => {
    if (!state) {
      return state;
    }

    const nextState = {
      ...state,
      permissionsGranted: true,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    };
  }),
  handleAction(refuseBrowserSuppport, (state) => {
    if (!state) {
      return state;
    }

    const nextState = {
      ...state,
      browserIsUnsupported: true,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    };
  }),
  handleAction(confirmJoiningRoomAction, (state, { payload }) => {
    if (!state) {
      return state;
    }

    const nextState: State = {
      ...state,
      confirmedRoomJoin: {
        status: true,
        roomSlug: payload.roomSlug,
      },
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    };
  }),
]);

export const stateSliceByKey = {
  roomBouncer: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
