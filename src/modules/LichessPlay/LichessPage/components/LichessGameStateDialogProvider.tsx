import React from 'react';
import { LichessGameDialogContext, lichessGameStateContext } from './LichessGameStateDialogContext';

type Props = NonNullable<LichessGameDialogContext>;

export const LichessGameStateDialogProvider: React.FC<Props> = ({children, ...contextProps}) => {
  return (
      <lichessGameStateContext.Provider value={contextProps}>
        {children}
      </lichessGameStateContext.Provider>
  );
};
