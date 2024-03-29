import { createStore, StoreEnhancer } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import { rootReducer } from './rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    // This could be persisted in the session rather than local storage
    'roomBouncer',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default (enhancers: StoreEnhancer) => {
  const store = createStore(persistedReducer, enhancers);

  const persistor = persistStore(store);

  return { store, persistor };
};
