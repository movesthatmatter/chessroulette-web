import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthentication } from './selectors';
import { AuthenticationContext } from './AuthenticationContext';
import {
  authenticateAsGuestEffect, authenticateEffect,
  // authenticateAsExistentGuestEffect,
  // authenticateWithAccessTokenEffect
} from './effects';
import { authentication } from './authentication';
import { useAuthentication, usePersistedAuthentication } from './useAuthentication';
import { unsetUserAction } from 'src/modules/User/actions';
import { selectAnyUser } from 'src/modules/User';
import { setUser } from '@sentry/browser';

type Props = {};

export const AuthenticationProvider: React.FC<Props> = (props) => {
  // const authenticationState = useAuthentication();
  const persistedAuthenticationState = usePersistedAuthentication();
  const user = useSelector(selectAnyUser);
  const dispatch = useDispatch();


  useEffect(() => {
    if (persistedAuthenticationState) {
      dispatch(setUser(persistedAuthenticationState));
    } else {
      dispatch(unsetUserAction);
    }
  }, [persistedAuthenticationState]);



  // const [persistedAuthentication, setPersistedA] = 

  // useEffect(() => {
  //   const 
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     authentication
  //       .get()
  //       .map((state) => {
  //         if (state.isGuest) {
  //           dispatch(authenticateAsGuestEffect(state))
  //         } else {
  //           dispatch(authenticateEffect(state.accessToken));
  //         }
  //       })
  //       .mapErr(() => {
  //         dispatch(authenticateAsGuestEffect());
  //       });

  //     // const accessTokenResult = await authentication.getAccessToken().resolve();

  //     // // If there is a User set it!
  //     // if (accessTokenResult.ok) {
  //     //   dispatch(authenticateWithAccessTokenEffect(accessTokenResult.val));
  //     //   return;
  //     // }

  //     // const guestResult = await authentication.getGuest().resolve();

  //     // // If there is an existing guest, set it!
  //     // if (guestResult.ok) {
  //     //   dispatch(authenticateAsExistentGuestEffect(guestResult.val));
  //     // } else {
  //     //   // Otherwise creatae a new guest!
  //     //   dispatch(authenticateAsGuestEffect());
  //     // }
  //   })();

    // if (authentication.authenticationType === 'user') {
    //   // TODO: Replace this with authenticateWithAccessTokenEffect
    //   // dispatch(authenticateExistentUserEffect(authentication.user.id));
    // } else if (authentication.authenticationType === 'guest') {
    //   dispatch(authenticateAsExistentGuestEffect(authentication.user));
    // } else {
    //   dispatch(authenticateAsGuestEffect());
  //   // }
  // }, []);

  // TODO: There should probably be different logic based on the auth state
  return (
    <AuthenticationContext.Provider value={user}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
