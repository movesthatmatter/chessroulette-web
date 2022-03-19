import { createContext } from 'react';
import { noop } from 'src/lib/util';
import { WarGameActions, getWarGameActions } from './WarGameActionsProxy';

export type WarGameProviderContextState = {
  warGameActions: WarGameActions;
};

export const WarGameProviderContext = createContext<WarGameProviderContextState>({
  warGameActions: getWarGameActions(noop),
});
