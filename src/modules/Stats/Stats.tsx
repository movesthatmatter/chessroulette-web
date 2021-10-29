import React, { ReactNode } from 'react';
import { createUseStyles } from 'src/lib/jss';
import dateformat from 'dateformat';
import { StatsTable } from './components';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { getUserDisplayName } from '../User';

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
                .map((peer) => getUserDisplayName(peer.user))
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
      format: (p) => getUserDisplayName(p.user),
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
    <div style={{display:'flex', flexDirection:'column'}}>
      <div style={{alignContent:'center', alignItems:'center'}}>
        <StatsTable caption="Rooms" data={props.rooms} columnsMap={roomColumnsMap} />
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignContent:'center', alignItems:'center'}}>
        <StatsTable caption="Peers" data={props.peers} columnsMap={peerColumnsMap} />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});