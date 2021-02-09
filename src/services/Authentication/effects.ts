import { Dispatch } from 'redux';
import { GuestUserRecord } from 'dstnd-io';
import { setGuestUserAction, setUserAction, unsetUserAction } from './actions';
import {
  authenticateAsExistentGuest,
  getUser,
  authenticateAsNewGuest,
} from './resources';

export const authenticateWithAccessTokenEffect = (accessToken: string) => async (dispatch: Dispatch) => {
  return getUser(accessToken)
    .map((user) => {
      dispatch(setUserAction({ user, accessToken }));

      return user;
    });
}

export const authenticateAsGuestEffect = () => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  return (await authenticateAsNewGuest()).map(({ guest }) => {
    dispatch(setGuestUserAction(guest));

    return guest;
  });
}

export const authenticateAsExistentGuestEffect = (
  guestUser: GuestUserRecord
) => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  return authenticateAsExistentGuest({ guestUser })
    .map(({ guest }) => {
      dispatch(setGuestUserAction(guest));

      return guest;
    });
}
