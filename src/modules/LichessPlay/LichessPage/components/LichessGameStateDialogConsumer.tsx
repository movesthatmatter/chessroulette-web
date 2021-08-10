import useInstance from '@use-it/instance';
import React, { useContext } from 'react';
import { LichessManagerType, getInstance as getLichessGameManager } from '../../LichessGameManager';
import { LichessGameStateDialog } from './LichessGameStateDialog';
import { lichessGameStateContext } from './LichessGameStateDialogContext';

export const LichessGameStateDialogConsumer: React.FC = () => {
  const context = useContext(lichessGameStateContext);
  const lichessManager = useInstance<LichessManagerType>(getLichessGameManager)

  if (!context) { 
    return null;
  }
  return (
    <LichessGameStateDialog 
    game={context.game}
    challenge={context.challenge}
    state={context.state}
    onChallengeAccepted={lichessManager.acceptChallenge}
    onChallengeDeny={lichessManager.declineChallenge}
    /> 
  );
};