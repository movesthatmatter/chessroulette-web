import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import config from 'src/config';
import { enhancer } from './enhancer';
import createPersistedStore from './persistedStore';

const { store, persistor } = createPersistedStore(enhancer);

export const ReduxProvider: React.FunctionComponent = ({ children }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {(bootstraped) => {
        // Hack: For some reason the persistor doens't set the bootstrapped flag to true
        //  when prerednering via react-snapshot, which in turn always return the Loader State
        // This workaround makes sure that the children are always rendered during prerendering
        if (bootstraped || config.PRERENDERING) {
          return children;
        }

        //return <AwesomeLoaderPage />
        return null;
      }}
    </PersistGate>
  </Provider>
);
