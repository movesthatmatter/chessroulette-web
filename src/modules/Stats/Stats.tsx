import { Box } from 'grommet';
import React, { ReactNode } from 'react';
import { createUseStyles } from 'src/lib/jss';
import dateformat from 'dateformat'
import { StatsTable } from './components';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';

type Props = {
  rooms: RoomStatsRecord[];
  peers: PeerRecord[];
};

export const Stats: React.FC<Props> = (props) => {
  const cls = useStyles();

  const roomColumnsMap: Partial<Record<
    keyof RoomStatsRecord,
    null | {format: (room: RoomStatsRecord) => ReactNode}
  >> = {
    id: null,
    name: null,
    peersCount: null,
    createdAt: {
      format: (r) => {
        return (
          <>
            {dateformat(r.createdAt, 'mmm dd, yy HH:MM:ss')}
          </>
        );
      }
    },
    createdBy: null,
    peers: {
      format: (r) => {
        return (
          <>
            {
              Object
                .values(r.peers)
                .map((peer) => peer.user.name)
                .join(', ')
            }
          </>
        )
      }
    },
  };

  const peerColumnsMap: Partial<Record<
    keyof PeerRecord | keyof PeerRecord['user'],
    null | {format: (room: PeerRecord) => ReactNode}
  >> = {
    id: null,
    name: {
      format: (p) => p.user.name,
    },
    joinedRoomId: null,
    joinedRoomAt: null,
    isGuest: {
      format: (p) => (
        <>
          {p.user.isGuest ? 'Guest' : 'Registered'}
        </>
      ),
    },
  };

  return (
    <Box direction="column">
      <Box align="center">
        <StatsTable caption="Rooms" data={props.rooms} columnsMap={roomColumnsMap} />
      </Box>
      <Box align="center">
        <StatsTable caption="Peers" data={props.peers} columnsMap={peerColumnsMap} />
        
      </Box>
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {},
});