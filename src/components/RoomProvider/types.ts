import { RoomStatsRecord, PeerRecord, RoomRecord } from 'dstnd-io';
import { PeerConnectionStatus } from 'src/services/peers';

export type Peer = PeerRecord & {
  connection: {
    channels: PeerConnectionStatus['channels'];
  };
};

export type Room = RoomRecord & {
  me: Peer;
  peers: Record<string, Peer>;
  peersCount: number;

  peersIncludingMe: Record<string, Peer>;
};
