import { Dispatch } from 'redux';
import {
  UserRecord,
  AuthenticationViaExternalAccountRequestPayload,
  GuestUserRecord,
} from 'dstnd-io';
import { setUserAction } from './actions';
import {
  authenticate,
  authenticateAsGuest,
  authenticateAsExistentGuest,
} from './resources';

export const authenticateExistentUserEffect = (
  userId: UserRecord['id']
) => async (dispatch: Dispatch) =>
  (await authenticate({ userId })).map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });

export const authenticateViaExternalAccountEffect = (
  opts: AuthenticationViaExternalAccountRequestPayload
) => async (dispatch: Dispatch) =>
  (await authenticate(opts)).map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });

export const authenticateAsGuestEffect = () => async (dispatch: Dispatch) =>
  (await authenticateAsGuest()).map(({ guest }) => {
    dispatch(setUserAction(guest));

    return guest;
  });

export const authenticateAsExistentGuestEffect = (
  guestUser: GuestUserRecord
) => async (dispatch: Dispatch) =>
  (await authenticateAsExistentGuest({ guestUser })).map(({ guest }) => {
    dispatch(setUserAction(guest));

    return guest;
  });
