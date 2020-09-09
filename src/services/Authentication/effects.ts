import { Dispatch } from 'redux';
import {
  UserRecord,
  AuthenticationViaExternalAccountRequestPayload,
} from 'dstnd-io';
import { setUserAction } from './actions';
import {
  authenticateAsGuest as authenticateAsGuestResource,
  authenticate as authenticateResource,
} from './resources';

export const authenticateExistentUser = (userId: UserRecord['id']) => async (
  dispatch: Dispatch
) =>
  (await authenticateResource({ userId })).map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });

export const authenticateViaExternalAccount = (
  opts: AuthenticationViaExternalAccountRequestPayload
) => async (dispatch: Dispatch) =>
  (await authenticateResource(opts)).map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });

export const authenticateAsGuest = () => async (dispatch: Dispatch) =>
  (await authenticateAsGuestResource()).map(({ guest }) => {
    dispatch(setUserAction(guest));

    return guest;
  });
