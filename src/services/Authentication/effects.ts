import { Dispatch } from 'redux';
import { GuestUserRecord } from 'dstnd-io';
import { setUserAction, unsetUserAction } from './actions';
import {
  authenticateAsGuest,
  authenticateAsExistentGuest,
  getUser,
} from './resources';

export const authenticateWithAccessTokenEffect = (token: string) => async (dispatch: Dispatch) => {
  return getUser(token)
    .map((user) => {
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
