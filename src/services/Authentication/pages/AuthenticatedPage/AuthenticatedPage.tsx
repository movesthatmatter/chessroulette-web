import { RegisteredUserRecord } from 'chessroulette-io';
import React, { ReactNode } from 'react';
import { Page, PageProps } from 'src/components/Page';
import { WithAuthenticatedPage } from '../../widgets/WithAuthenticatedPage';

type Props = PageProps & {
  render?: (p: { user: RegisteredUserRecord }) => ReactNode;
};

export const AuthenticatedPage: React.FC<Props> = ({
  render,
  children: givenChildren,
  ...props
}) => {
  return (
    <WithAuthenticatedPage
      render={(r) => {
        const children = render ? render(r) : givenChildren;

        return <Page {...props}>{children}</Page>;
      }}
    />
  );
};
