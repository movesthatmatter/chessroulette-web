import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Peer, Room } from 'src/components/RoomProvider';
import { SocketConsumer } from 'src/components/SocketProvider';
import { createUseStyles } from 'src/lib/jss';
import { resources } from 'src/resources';
import { selectAuthentication } from 'src/services/Authentication';
import { Stats } from './Stats';

type Props = {};

export const StatsContainer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [rooms, setRooms] = useState<RoomStatsRecord[]>([]);
  const [peers, setPeers] = useState<PeerRecord[]>([]);

  const authentication = useSelector(selectAuthentication);

  console.log('works');

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
        if (msg.kind === 'peersStats') {
          setPeers(msg.content);
        } else if (msg.kind === 'roomsStats') {
          setRooms(msg.content);
        }
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