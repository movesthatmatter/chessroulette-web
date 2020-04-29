import React, { ComponentType } from 'react';

const HTTPContext = React.createContext(null);

export function withHTTPPRovider<T>(Component: ComponentType<T>) {
  return (props: T) => (
    <HTTPContext.Consumer>
      {(httpProvider) => <Component {...props} httpProvider={httpProvider} />}
    </HTTPContext.Consumer>
  );
}

export default HTTPContext;
