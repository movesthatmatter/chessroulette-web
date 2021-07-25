import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { BrowserRouter } from 'react-router-dom';
import { StorybookReduxProvider } from './StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';

type Props = {
  withRedux?: boolean;
  withAuthentication?: boolean;
};

const userMocker = new UserRecordMocker();

// This provides all the utilities needed to render a Basic Story:
//   - Grommet Theme
//   - Browser Router
//
// This is generally only needed when using a component that depends on other components
//  that might use some of the providers above
export const StorybookBaseProvider: React.FunctionComponent<Props> = ({
  children,
  withRedux = false,
  withAuthentication = false,
}) => {
  withRedux = withAuthentication || withRedux;

  const base = (
    <Grommet theme={defaultTheme} full>
      <BrowserRouter>{children}</BrowserRouter>
    </Grommet>
  );

  if (withRedux) {
    return (
      <StorybookReduxProvider
        initialState={{
          ...(withAuthentication && {
            authentication: {
              authenticationType: 'user',
              user: userMocker.registered(),
              accessToken: '1234-access-token',
            },
          }),
        }}
      >
        {base}
      </StorybookReduxProvider>
    );
  }

  return base;
};
