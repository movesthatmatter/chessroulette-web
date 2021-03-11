import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthentication } from './selectors';
import { AuthenticationContext } from './AuthenticationContext';
import {
  authenticateAsGuestEffect,
  authenticateAsExistentGuestEffect,
} from './effects';

type Props = {};

export const AuthenticationProvider: React.FC<Props> = (props) => {
  const authentication = useSelector(selectAuthentication);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authentication.authenticationType === 'user') {
      // TODO: Replace this with authenticateWithAccessTokenEffect
      // dispatch(authenticateExistentUserEffect(authentication.user.id));
    } else if (authentication.authenticationType === 'guest') {
      dispatch(authenticateAsExistentGuestEffect(authentication.user));
    } else {
      dispatch(authenticateAsGuestEffect());
    }
  }, []);

  // TODO: There should probably be different logic based on the auth state
  return (
    <AuthenticationContext.Provider value={authentication}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
