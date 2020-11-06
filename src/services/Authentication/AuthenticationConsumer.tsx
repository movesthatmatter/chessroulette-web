import React, { useContext } from 'react';
import { noop } from 'src/lib/util';
import { AuthenticationContext } from './AuthenticationContext';
import { AuthenticationStateGuest, AuthenticationStateUser } from './reducer';

type Props = {
  renderAuthenticated?: (user: AuthenticationStateUser['user'] | AuthenticationStateGuest['user']) => React.ReactElement;
  renderNotAuthenticated?: () => React.ReactElement;
};

export const AuthenticationConsumer: React.FC<Props> = ({
  renderAuthenticated = noop,
  renderNotAuthenticated = noop,
}) => {
  const contextState = useContext(AuthenticationContext);

  if (contextState.authenticationType === 'none') {
    return (
      <>
        {renderNotAuthenticated()}
      </>
    );
  }

  return (
    <>
      {renderAuthenticated(contextState.user)}
    </>
  );
};
