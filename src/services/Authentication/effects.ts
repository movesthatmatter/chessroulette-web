import { Dispatch } from 'redux';
import { GuestUserRecord, RegisteredUserRecord, UserInfoRecord, UserRecord } from 'dstnd-io';
import { setGuestUserAction, setUserAction, unsetUserAction, updateUserAction } from './actions';
import {
  authenticateAsExistentGuest,
  getUser,
  authenticateAsNewGuest,
  connectExternalAccount,
  updateUser
} from './resources';
import { authentication } from './authentication';

export const authenticateWithAccessTokenEffect = (accessToken: string) => async (dispatch: Dispatch) => {
  // Persist the Auth Token outside of Redux
  //  so other services (outside of the DOM) have access to it
  //  like the Http
  // Needs to be done before the getUser() is called
  //  so the access token can be used by the http instance
  await authentication.persistAccessToken(accessToken);

  return getUser()
    .map((user) => {
      dispatch(setUserAction({ user, accessToken }));

      return user;
    });
}

export const authenticateAsGuestEffect = () => async (dispatch: Dispatch) => {
  // Reset the possible stale current user to make sure it's never used
  dispatch(unsetUserAction());

  // Remove the Auth Token
  await authentication.removeAccessToken();

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

  // Remove the Auth Token
  await authentication.removeAccessToken();

  return authenticateAsExistentGuest({ guestUser })
    .map(({ guest }) => {
      dispatch(setGuestUserAction(guest));

      return guest;
    });
}

export const refreshAuthenticatedUser = () => async (dispatch: Dispatch) => {
  return getUser()
    .map((user) => {
      dispatch(updateUserAction({ user }));

      return user;
    });
}

export const connectExternalAccountEffect = (
  req: Parameters<typeof connectExternalAccount>[0],
) => (dispatch: Dispatch) => {
  return connectExternalAccount(req)
    .map((user) => {
      dispatch(updateUserAction({ user }));
    });
}
