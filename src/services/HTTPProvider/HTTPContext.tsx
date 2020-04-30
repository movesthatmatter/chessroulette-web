import React, { ComponentType } from 'react';

const HTTPContext = React.createContext(null);


export function withHTTPProvider<T>(Component: ComponentType<T>) {
  return (props: T) => (
    <HTTPContext.Consumer>
      {(httpProvider) => <Component {...props as T} httpProvider={httpProvider} />}
    </HTTPContext.Consumer>
  );
}

export default HTTPContext;
