import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthentication } from './selectors';
import { RegisteredUserRecord } from 'dstnd-io';
import { AuthenticationContext } from './AuthenticationContext';

export const useAuthenticationService = () => useContext(AuthenticationContext);

export const useAuthentication = () => useSelector(selectAuthentication);

export const useAnyUser = () => {
  const auth = useSelector(selectAuthentication);

  return auth.authenticationType !== 'none' ? auth.user : undefined;
};

// This Returns a Registered User, not a Guest
export const useAuthenticatedUser = () => {
  const user = useAnyUser();

  if (user?.isGuest === false) {
    return user;
  }

  return undefined;
};

export const useUserAuthentication = () => {
  const auth = useAuthentication();

  if (auth.authenticationType === 'user') {
    return auth;
  }

  return undefined;
};

export type RegisteredUserRecordWithLichessConnection = RegisteredUserRecord & {
  externalAccounts: {
    lichess: NonNullable<NonNullable<RegisteredUserRecord['externalAccounts']>['lichess']>;
  };
};

export const useAuthenticatedUserWithLichessAccount = ():
  | RegisteredUserRecordWithLichessConnection
  | undefined => {
  const user = useAnyUser();

  if (!user?.isGuest && user?.externalAccounts?.lichess) {
    return user as RegisteredUserRecordWithLichessConnection;
  }

  return undefined;
};
