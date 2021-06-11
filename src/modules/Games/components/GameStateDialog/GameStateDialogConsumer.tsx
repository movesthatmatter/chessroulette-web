import React, { useContext } from 'react';
import { GameStateDialog } from './components/GameStateDialog';
import { GameStateDialogContext } from './GameStateDialogContext';

export const GameStateDialogConsumer: React.FC = () => {
  const context = useContext(GameStateDialogContext);

  // TODO: Ensure the myPlayer actually needs to be enforced
  if (!(context && context.myPlayer)) {
    return null;
  }

  return (
    <GameStateDialog
      isMobile={context.isMobile}
      myPlayer={context.myPlayer}
      room={context.room}
      game={context.game}
    />
  );
};
