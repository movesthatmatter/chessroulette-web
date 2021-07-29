import React, { useContext } from 'react';
// import { useMyPeerPlayerStats } from 'src/modules/Room/Activities/PlayActivity/hooks/useMyPeerPlayerStats';
import { UserAsPlayerStats } from 'src/modules/Games/Chess/lib';
import { useJoinedRoom } from 'src/modules/Room/hooks/useJoinedRoom';
import { GameStateDialog } from './components/GameStateDialog';
import { GameStateDialogContext } from './GameStateDialogContext';

export const GameStateDialogConsumer: React.FC = () => {
  const context = useContext(GameStateDialogContext);

  if (!context) {
    return null;
  }

  return <GameStateDialog isMobile={context.isMobile} activity={context.activity} />;
};
