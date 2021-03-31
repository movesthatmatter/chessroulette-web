import { Dispatch } from 'redux';
import { GuestUserRecord } from 'dstnd-io';
import { setGuestUserAction, setUserAction, unsetUserAction, updateUserAction } from './actions';
import {
  authenticateAsExistentGuest,
  getUser,
  authenticateAsNewGuest,
  connectExternalAccount,
} from './resources';
import { authentication } from './authentication';

export const authenticateEffect = (accessToken: string) => async (dispatch: Dispatch) => {
  // Persist the Auth Token outside of Redux
  //  so other services (outside of the DOM) have access to it
  //  like the Http
  // Needs to be done before the getUser() is called
  //  so the access token can be used by the http instance
  await authentication.create({
    isGuest: false,
    accessToken,
  });

  return getUser().map((user) => {
    dispatch(unsetUserAction());

    dispatch(setUserAction({ user, accessToken }));

    return user;
  });
};

export const authenticateAsGuestEffect = (guest?: GuestUserRecord) => async (
  dispatch: Dispatch
) => {
  const guestResult = guest
    ? authenticateAsExistentGuest({ guestUser: guest })
    : authenticateAsNewGuest();

  guestResult.map(async ({ guest }) => {
    await authentication.create(guest);
    
    // Reset the possible stale current user to make sure it's never used
    dispatch(unsetUserAction());
    dispatch(setGuestUserAction(guest));
  });
};

export const deauthenticate = () => async (dispatch: Dispatch) => {
  await authentication.remove();

  dispatch(unsetUserAction());

  // TODO: For now automatically "authenticate" as guest
  return (await authenticateAsNewGuest()).map(({ guest }) => {
    dispatch(setGuestUserAction(guest));

    return undefined;
  });
};

export const updateAuthenticatedUser = () => async (dispatch: Dispatch) => {
  return getUser().map((user) => {
    dispatch(updateUserAction({ user }));

    return user;
  });
};

export const connectExternalAccountEffect = (req: Parameters<typeof connectExternalAccount>[0]) => (
  dispatch: Dispatch
) => {
  return connectExternalAccount(req).map((user) => {
    dispatch(updateUserAction({ user }));
  });
};
