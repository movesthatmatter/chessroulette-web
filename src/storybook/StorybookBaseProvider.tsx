import React from 'react';
import { themes } from 'src/theme';
import { BrowserRouter } from 'react-router-dom';
import { StorybookReduxProvider } from './StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';
import { RootState } from 'src/redux/rootReducer';
import { ThemeProvider } from 'react-jss';

type Props = {
  withAuthentication?: boolean;
} & (
  | {
      withRedux: true;
      initialState?: Partial<RootState>;
    }
  | {
      withRedux?: false;
    }
);

const userMocker = new UserRecordMocker();

// This provides all the utilities needed to render a Basic Story:
//   - Browser Router
//
// This is generally only needed when using a component that depends on other components
//  that might use some of the providers above

export const StorybookBaseProvider: React.FunctionComponent<Props> = ({
  children,
  withAuthentication = false,
  ...props
}) => {
  const withRedux = withAuthentication || props.withRedux;

  const base = (
    <ThemeProvider theme={themes.lightDefault}>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );

  if (withRedux) {
    return (
      <StorybookReduxProvider
        initialState={{
          ...(props.withRedux && props.initialState),
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
