import {
  PeerRecord,
  RoomRecord,
  RoomWithPlayActivityRecord,
  RoomWithNoActivityRecord,
} from 'dstnd-io';
import { PeerConnectionStatus } from 'src/services/peers';

export type RoomCredentials = {
  id: string;
  code?: string;
}

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

export type RoomWithNoActivity = Room & Pick<RoomWithNoActivityRecord, 'activity'>;
export type RoomWithPlayActivity = Room & Pick<RoomWithPlayActivityRecord, 'activity'>;
