import React, { useContext } from 'react';
import { noop } from 'src/lib/util';
import { AuthenticationContext } from './AuthenticationContext';
import { AuthenticationStateGuest, AuthenticationStateUser } from './reducer';

type Props = {
  renderAuthenticated: (
    auth: AuthenticationStateGuest | AuthenticationStateUser
  ) => React.ReactElement;
  renderNotAuthenticated?: () => React.ReactElement;
};

export const AuthenticationConsumer: React.FC<Props> = ({
  renderNotAuthenticated = noop,
  ...props
}) => {
  const contextState = useContext(AuthenticationContext);

  return (
    <>
      {contextState.authenticationType === 'none'
        ? renderNotAuthenticated()
        : props.renderAuthenticated(contextState)}
    </>
  );
};
