import React, { useContext } from 'react';
import { LichessGameStateDialog } from './LichessGameStateDialog';
import { lichessGameStateContext } from './LichessGameStateDialogContext';

export const LichessGameStateDialogConsumer: React.FC = () => {
  const context = useContext(lichessGameStateContext);

  if (!context) { 
    return null;
  }
  return (
    <LichessGameStateDialog 
    game={context.game}
    challenge={context.challenge}
    state={context.state}
    onChallengeAccepted={() => {console.log('challenge accepted')}}
    onChallengeDeny={() => {console.log('challenge deny')}}
    /> 
  );
};