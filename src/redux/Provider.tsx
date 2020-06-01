import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './rootReducer';
import { enhancer } from './enhancer';

const store = createStore(rootReducer, enhancer);

export const ReduxProvider: React.FunctionComponent = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);
