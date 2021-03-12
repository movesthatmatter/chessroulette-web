import { RegisteredUserRecord } from 'dstnd-io';
import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { AuthenticationDialog } from 'src/services/Authentication/widgets';
import { Page, PageProps } from './Page';

type Props = PageProps & {
  render?: (p: { user: RegisteredUserRecord }) => ReactNode;
};

export const AuthenticatedPage: React.FC<Props> = ({
  render,
  ...props
}) => {
  const user = useAuthenticatedUser();
  const history = useHistory()

  if (!user) {
    return (
      <AuthenticationDialog visible onClose={() => {
        history.replace('/');
      }}/>
    );
  }

  const children = render ? render({ user }) : props.children;

  return (
    <Page {...props} children={children} />
  );
};
