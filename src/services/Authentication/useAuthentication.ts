import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authentication, AuthenticationRecord } from './authentication';
// import { selectAuthentication } from './selectors';


export const usePersistedAuthentication = () => {
  const [state, setState] = useState<AuthenticationRecord>();

  useEffect(() => {
    authentication.get()
      .map((record) => {
        setState(record);
      });
  }, []);

  useEffect(() => {
    authentication.onUpdated((nextRecord) => {
      setState(nextRecord);
    });
  }, []);

  return state;
}

// @Deprecate in favor of usePersisteedAuthentication and rename that useaAuehtntication
//  in order to havee only one source of truth.
//  This way there will be no redux for the authneticaation any more, b/c the current
//  redux will be renamed to User
// export const useAuthentication = () => useSelector(selectAuthentication);

// export const useAnyUser = () => {
//   const auth = useSelector(selectAuthentication);

//   return auth.authenticationType !== 'none' ? auth.user : undefined;
// };

// // This Returns a Registered User, not a Guest
// export const useAuthenticatedUser = () => {
//   const user = useAnyUser();

//   if (user?.isGuest === false) {
//     return user;
//   }

//   return undefined;
// };

// export const useUserAuthentication = () => {
//   const auth = useAuthentication();

//   if (auth.authenticationType === 'user') {
//     return auth;
//   }

//   return undefined;
// };
