import { createContext } from 'react';
import { noop } from 'src/lib/util';
import { GameActions, getGameActions } from './GameActionsProxy';

export type GameProviderContextState = {
  gameActions: GameActions;
};

export const GameProviderContext = createContext<GameProviderContextState>({
  gameActions: getGameActions(noop),
});
