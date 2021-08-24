import React, { createContext } from 'react';
import { Game } from 'src/modules/Games';
import { LichessGameState } from '../../types';

export type LichessGameDialogContext = {
  status :  LichessGameState['status'] | undefined;
  game : Game | undefined;
} | undefined;

export const LichessGameStateContext = createContext<LichessGameDialogContext>(undefined);

type Props = NonNullable<LichessGameDialogContext>;

export const LichessGameStateDialogProvider: React.FC<Props> = ({children, ...contextProps}) => {
  return (
      <LichessGameStateContext.Provider value={contextProps}>
        {children}
      </LichessGameStateContext.Provider>
  );
};
