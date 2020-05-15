import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { PeerConnectionStatus } from 'src/services/peers';


export type Peer = PeerRecord & {
  avatarId: string;
  connection: {
    channels: PeerConnectionStatus['channels'];
  };
}

export type Room = RoomStatsRecord & {
  peers: Record<string, Peer>;
}
