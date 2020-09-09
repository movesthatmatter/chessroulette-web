import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { enhancer } from 'src/redux/enhancer';
import { createStore } from 'redux';
import { rootReducer, RootState } from 'src/redux/rootReducer';

type Props = {
  initialState?: Partial<RootState>;
};

// const { store, persistor } = createPersistedStore(enhancer);

export const StorybookReduxProvider: React.FunctionComponent<Props> = ({
  children,
  initialState = {},
}) => {
  const memoizedStore = useMemo(
    () =>
      // These are mutating the store, therefore only have them run when needed,
      //  but make sure they're only run once!
      createStore(rootReducer, initialState, enhancer),
    []
  );

  return <Provider store={memoizedStore}>{children}</Provider>;
};
