import React, { useContext } from 'react';
import { GameStateDialog } from './components/GameStateDialog';
import { GameStateDialogContext } from './GameStateDialogContext';

export const GameStateDialogConsumer: React.FC = () => {
  const context = useContext(GameStateDialogContext);

  if (!context) {
    return null;
  }

  return (
    <GameStateDialog
      dialogNotificationTypes={context.dialogNotificationTypes}
      activity={context.activity}
    />
  );
};
