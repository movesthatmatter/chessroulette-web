import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGuest } from './effects';
import { selectAuthentication } from './selectors';
import { AuthenticationContext } from './AuthenticationContext';

type Props = {};

export const AuthenticationProvider: React.FC<Props> = (props) => {
  const authentication = useSelector(selectAuthentication);
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: This will check for a real user auth
    dispatch(setGuest());
  }, []);

  // TODO: There should probably be different logic based on the auth state
  return (
    <AuthenticationContext.Provider value={authentication}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
