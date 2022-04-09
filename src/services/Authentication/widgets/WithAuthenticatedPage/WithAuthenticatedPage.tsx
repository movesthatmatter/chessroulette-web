import React, { ReactNode } from 'react';
import { RegisteredUserRecord } from 'chessroulette-io';
import { AuthenticationPage } from '../../pages/AuthenticationPage';
import { useAuthentication } from '../../useAuthentication';

type Props = {
  render?: (p: { user: RegisteredUserRecord }) => ReactNode;
};

export const WithAuthenticatedPage: React.FC<Props> = ({ render, ...props }) => {
  const authentication = useAuthentication();

  if (authentication.authenticationType !== 'user') {
    return <AuthenticationPage />;
  }

  const children = render ? render({ user: authentication.user }) : props.children;

  return <>{children}</>;
};
