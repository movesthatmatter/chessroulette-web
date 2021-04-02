import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setGuestUserAction, setUserAction } from './actions';
import * as resources from './resources';
import { useAuthenticationService } from './useAuthentication';

export const AuthenticationProvider: React.FC = (props) => {
  const authService = useAuthenticationService();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authService.ready) {
      return;
    }

    if (!authService.state) {
      resources
        .authenticateAsNewGuest()
        // Create the authentication with the new guest but don't
        //  publish a new auth update to not start an infinite loop
        .flatMap(({ guest }) => authService.createSilently(guest))
        .map((guest) => dispatch(setGuestUserAction(guest)));

      return;
    }

    if (authService.state.isGuest) {
      resources
        .authenticateAsExistentGuest({ guestUser: authService.state })
        // Create the authentication with the new guest but don't
        //  publish a new auth update to not start an infinite loop
        .flatMap(({ guest }) => authService.createSilently(guest))
        .map((guest) => {
          dispatch(setGuestUserAction(guest));
        });

      return;
    }

    const { accessToken } = authService.state;

    resources
      .getUser()
      .map((user) => {
        dispatch(setUserAction({ user, accessToken }));
      });
  }, [authService]);

  // TODO: There should probably be different logic based on the auth state
  return <>{props.children}</>;
};
