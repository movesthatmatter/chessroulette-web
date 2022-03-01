import {
  PeerRecord,
  RoomRecord,
  RoomWithPlayActivityRecord,
  RoomWithNoActivityRecord,
  RoomWithAnalysisActivityRecord,
  UserRecord,
  ClassRoomRecord,
} from 'chessroulette-io';

export type PeerStreamingConfigOn = {
  on: true;
  type: 'audio' | 'video' | 'audio-video';
  stream: MediaStream;
};

export type PeerStreamingConfigOff = {
  on: false;
};

export type PeerStreamingConfig = PeerStreamingConfigOn | PeerStreamingConfigOff;

export type Peer = PeerRecord & {
  isMe: boolean;
  userId: UserRecord['id'];
  connection: {
    channels: {
      data: {
        on: boolean;
      };
      streaming: PeerStreamingConfig;
    };
  };
};
export type PeersMap = Record<Peer['user']['id'], Peer>;

export type StreamingPeer = Peer & {
  connection: Peer['connection'] & {
    channels: Peer['connection']['channels'] & {
      streaming: PeerStreamingConfigOn;
    };
  };
};
export type StreamingPeersMap = Record<StreamingPeer['user']['id'], StreamingPeer>;

export const isStreamingPeer = (p: Peer): p is StreamingPeer => p.connection.channels.streaming.on === true;

// TODO: Take this away from here into the RoomProvider or somewhere else
// Room

export type RoomCredentials = {
  id: string;
  code?: string;
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
