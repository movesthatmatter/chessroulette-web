import { RegisteredUserRecord } from 'dstnd-io';
import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthentication } from 'src/services/Authentication';
import { AuthenticationDialog } from 'src/services/Authentication/widgets';
import { AwesomeLoaderPage } from '../AwesomeLoader';
import { Page, PageProps } from './Page';

type Props = PageProps & {
  render?: (p: { user: RegisteredUserRecord }) => ReactNode;
};

export const AuthenticatedPage: React.FC<Props> = ({
  render,
  ...props
}) => {
  const history = useHistory();
  const authentication = useAuthentication();

  if (authentication.authenticationType === 'none') {
    return <AwesomeLoaderPage />
  }

  if (authentication.authenticationType === 'guest') {
    return (
      <AuthenticationDialog visible onClose={() => {
        history.replace('/');
      }}/>
    );
  }

  const children = render ? render({ user: authentication.user }) : props.children;

  return (
    <Page {...props} children={children} />
  );
};
