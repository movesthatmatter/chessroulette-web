import { Dispatch } from 'redux';
import {
  UserRecord,
  AuthenticationViaExternalAccountRequestPayload,
  GuestUserRecord,
} from 'dstnd-io';
import { setUserAction, unsetUserAction } from './actions';
import {
  authenticate,
  authenticateAsGuest,
  authenticateAsExistentGuest,
} from './resources';

export const authenticateExistentUserEffect = (
  userId: UserRecord['id']
) => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  return (await authenticate({ userId })).map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });
}

export const authenticateViaExternalAccountEffect = (
  opts: AuthenticationViaExternalAccountRequestPayload
) => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  return (await authenticate(opts)).map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });
}

export const authenticateAsGuestEffect = () => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  return (await authenticateAsGuest()).map(({ guest }) => {
    dispatch(setUserAction(guest));

    return guest;
  });
}

export const authenticateAsExistentGuestEffect = (
  guestUser: GuestUserRecord
) => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  return (await authenticateAsExistentGuest({ guestUser })).map(({ guest }) => {
    dispatch(setUserAction(guest));

    return guest;
  });
}
