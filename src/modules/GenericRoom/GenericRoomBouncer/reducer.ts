import { createReducer, createAction } from 'deox';
import { GenericStateSlice } from 'src/redux/types';

export type State = {
  // Cqmera & Mic Permissions
  permissionsRequestAgreed: boolean;
  permissionsGranted: boolean;
  browserIsSupported: boolean;
  confirmedRoomJoin: boolean;

  ready: boolean;
}

export const initialState: State = {
  permissionsRequestAgreed: false,
  permissionsGranted: false,
  confirmedRoomJoin: false,

  // This is true by default until a check called from
  // a specific place sets it to false!
  browserIsSupported: true,

  // TODO: Add
  // loggedInIfRandom: false

  ready: false,
};

export const agreePermissionsRequestAction = createAction('AgreePermissionsRequest');
export const grantPermissionsAction = createAction('GrantPermisssions');
export const refuseBrowserSuppport = createAction('RefuseBrowserSuppport');
export const confirmJoiningRoomAction = createAction('ConfirmJoiningRoomAction');

const getReadyFlag = (state: State) => {
  return state.permissionsGranted && state.confirmedRoomJoin && state.browserIsSupported;
}

export const reducer = createReducer(initialState as State, (handleAction) => ([
  handleAction(agreePermissionsRequestAction, (state) => {
    const nextState = {
      ...state,
      permissionsRequestAgreed: true,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    }
  }),
  handleAction(grantPermissionsAction, (state) => {
    const nextState = {
      ...state,
      permissionsGranted: true,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    }
  }),
  handleAction(refuseBrowserSuppport, (state) => {
    const nextState = {
      ...state,
      browserIsSupported: false,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    }
  }),
  handleAction(confirmJoiningRoomAction, (state) => {
    const nextState = {
      ...state,
      confirmedRoomJoin: true,
    };

    return {
      ...nextState,
      ready: getReadyFlag(nextState),
    }
  })
]));

export const stateSliceByKey = {
  roomBouncer: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
