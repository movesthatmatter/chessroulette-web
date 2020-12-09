import { createReducer, createAction } from 'deox';

export type State = {
  // Cmmera & Mic Permissions
  permissionsRequestAgreed: boolean;
  permissionsGranted: boolean;
  confirmedRoomJoin: boolean;

  ready: boolean;
}

export const initialState: State = {
  permissionsRequestAgreed: false,
  permissionsGranted: false,
  confirmedRoomJoin: false,

  // TODO: Add
  // loggedInIfRandom: false

  ready: false,
};

export const agreePermissionsRequestAction = createAction('AgreePermissionsRequest');
export const grantPermissionsAction = createAction('GrantPermisssions');
export const confirmAction = createAction('Confirm');

const getReadyFlag = (state: State) => {
  return state.permissionsGranted && state.confirmedRoomJoin;
}

export const reducer = createReducer(initialState as State, (handleAction) => ([
  handleAction(agreePermissionsRequestAction, (state) => {
    const nextState = {
      ...state,
      permissionsRequestAgreed: true,
    };

    return {
      ...nextState,

      // Ready!
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

      // Ready!
      ready: getReadyFlag(nextState),
    }
  }),
  handleAction(confirmAction, (state) => {
    const nextState = {
      ...state,
      confirmedRoomJoin: true,
    };

    return {
      ...nextState,

      // Ready!
      ready: getReadyFlag(nextState),
    }
  })
]));
