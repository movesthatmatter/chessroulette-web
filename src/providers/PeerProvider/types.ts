import {
  PeerRecord,
  RoomRecord,
  RoomWithPlayActivityRecord,
  RoomWithNoActivityRecord,
  RoomWithAnalysisActivityRecord,
  UserRecord,
  ClassRoomRecord,
} from 'dstnd-io';
import { PeerConnectionStatus } from 'src/services/peers';

export type RoomCredentials = {
  id: string;
  code?: string;
};

export type Peer = PeerRecord & {
  isMe: boolean;
  userId: UserRecord['id'];
  connection: {
    channels: PeerConnectionStatus['channels'];
  };
};

type RoomBasics = {
  me: Peer;
  peers: Record<string, Peer>;
  peersCount: number;

  peersIncludingMe: Record<string, Peer>;
};

export type Room = RoomRecord & RoomBasics;
export type ClassRoom = ClassRoomRecord & RoomBasics;

export type RoomWithNoActivity = Room & Pick<RoomWithNoActivityRecord, 'activity'>;
export type RoomWithPlayActivity = Room & Pick<RoomWithPlayActivityRecord, 'activity'>;
export type RoomWithAnalysisActivity = Room & Pick<RoomWithAnalysisActivityRecord, 'activity'>;
