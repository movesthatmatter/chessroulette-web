import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authenticationService, AuthenticationRecord } from './authenticationService';
import { selectAuthentication } from './selectors';

export const useAuthenticationService = () => {
  const [state, setState] = useState<AuthenticationRecord>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authenticationService.get()
      .map((record) => {
        setState(record);
        setReady(true);
      })
      .mapErr(() => {
        setReady(true);
      })
  }, []);

  useEffect(() => {
    authenticationService.onUpdated((nextRecord) => {
      setState(nextRecord);
    });
  }, []);

  if (!ready) {
    return {
      ready,
      ...authenticationService,
    } as const
  }

  return {
    ready,
    state,
    ...authenticationService,
  } as const;
}

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

export const useAuthenticatedUserWithLichessAccount = () => {
  const user = useAnyUser();
  if (!user?.isGuest && user?.externalAccounts?.lichess){
    return user;
  }
  return undefined;
}
