import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { enhancer } from './enhancer';
import createPersistedStore from './persistedStore';

// const store = createStore(rootReducer, enhancer);

const { store, persistor } = createPersistedStore(enhancer);

export const ReduxProvider: React.FunctionComponent = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={AwesomeLoaderPage} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);
