import { PeerRecord, RoomStatsRecord } from 'chessroulette-io';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketConsumer } from 'src/providers/SocketProvider';
import { createUseStyles } from 'src/lib/jss';
import { selectAuthentication } from 'src/services/Authentication';
import { Stats } from './Stats';

type Props = {};

export const StatsContainer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [rooms, setRooms] = useState<RoomStatsRecord[]>([]);
  const [peers, setPeers] = useState<PeerRecord[]>([]);

  const authentication = useSelector(selectAuthentication);

  // This should never happen
  if (authentication.authenticationType === 'none') {
    return (
      <div>
        Not Authenticated
      </div>
    );
  }

  return (
    <SocketConsumer
      onMessage={(msg) => {
        
      }}
      render={(p) => (
        <Stats rooms={rooms} peers={peers}/>
      )}
      onReady={(p) => {
        console.log('sending');
        p.send({
          kind: 'statsReaderIdentificationPayload',
          content: {
            userId: authentication.user.id,
          },
        });
      }}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});