import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { LichessProvider } from 'src/modules/LichessPlay/LichessAPI/LichessProvider';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { usePeerState } from 'src/providers/PeerProvider';
import { RoomLichessActivity } from '../PlayActivity';
import { ChessGameHistoryProvider, ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';

type Props = {
  activity: RoomLichessActivity;
};

export const LichessActivity: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();

  if (peerState.status !== 'open') {
    return null;
  }

  const {game} = props.activity

  console.log('DAAAA LICHESSSS')
  return (
    <LichessProvider>
      <GenericLayoutDesktopRoomConsumer
      renderActivity={(boardSize) => (
        <ChessGameHistoryProvider history={game?.history || []}>
          DA DA DA Lichess play
        </ChessGameHistoryProvider>
      )}
      />
    </LichessProvider>
  );
};

const useStyles = createUseStyles({
  container: {},
});