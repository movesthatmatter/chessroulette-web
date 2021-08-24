import React, { useContext } from 'react';
import { LichessGameStateDialog } from './LichessGameStateDialog';
import { LichessGameStateContext } from './LichessGameStateDialogProvider';

export const LichessGameStateDialogConsumer: React.FC = () => {
  const context = useContext(LichessGameStateContext);

  if (!context) { 
    return null;
  }

  return (
    <LichessGameStateDialog 
      game={context.game}
      status={context.status}
    /> 
  );
};
