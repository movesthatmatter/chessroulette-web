import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGuestUserAction, setUserAction } from './actions';
import * as resources from './resources';
import { AuthenticationContext, AuthenticationContextState } from './AuthenticationContext';
import { authenticationService } from './authenticationService';

export const AuthenticationProvider: React.FC = (props) => {
  const dispatch = useDispatch();
  const [contextState, setContextState] = useState<AuthenticationContextState>({
    ready: false,
    ...authenticationService,
  });

  useEffect(() => {
    authenticationService
      .get()
      .map((record) => {
        setContextState((prev) => ({
          ...prev,
          ready: true,
          state: record,
        }));
      })
      .mapErr(() => {
        setContextState((prev) => ({
          ...prev,
          ready: true,
          state: undefined,
        }));
      });

    const onUpdateUnsubscribe = authenticationService.onUpdated((nextRecord) => {
      setContextState((prev) => ({
        ...prev,
        state: nextRecord,
      }));
    });

    return () => {
      onUpdateUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!contextState.ready) {
      return;
    }

    if (!contextState.state) {
      resources
        .authenticateAsNewGuest()
        // Create the authentication with the new guest but don't
        //  publish a new auth update to not start an infinite loop
        .flatMap(({ guest }) => contextState.createSilently(guest))
        .map((guest) => dispatch(setGuestUserAction(guest)));

      return;
    }

    if (contextState.state.isGuest) {
      resources
        .authenticateAsExistentGuest({ guestUser: contextState.state })
        // Create the authentication with the new guest but don't
        //  publish a new auth update to not start an infinite loop
        .flatMap(({ guest }) => contextState.createSilently(guest))
        .map((guest) => {
          dispatch(setGuestUserAction(guest));
        });

      return;
    }

    const { accessToken } = contextState.state;

    resources.getUser().map((user) => {
      dispatch(setUserAction({ user, accessToken }));
    });
  }, [contextState]);

  return (
    <AuthenticationContext.Provider value={contextState}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
