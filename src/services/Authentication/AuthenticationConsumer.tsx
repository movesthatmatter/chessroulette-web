import React, { useContext } from 'react';
import { noop } from 'src/lib/util';
import { AuthenticationContext } from './AuthenticationContext';
import { AuthenticationStateGuest, AuthenticationStateUser } from './reducer';

type Props = {
  renderAuthenticated?: (user: AuthenticationStateUser['user']) => React.ReactElement;
  renderGuest?: (guest: AuthenticationStateGuest['user']) => React.ReactElement;
  renderNotAuthenticated?: () => React.ReactElement;
};

export const AuthenticationConsumer: React.FC<Props> = ({
  renderAuthenticated = noop,
  renderNotAuthenticated = noop,
  renderGuest = noop,
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
      {contextState.authenticationType === 'user'
        ? renderAuthenticated(contextState.user)
        : renderGuest(contextState.user)
      }
    </>
  );
};
