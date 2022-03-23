import { PeerRecord, UserRecord } from 'dstnd-io';

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

// TODO: Does it make sense to have the Peer = StreamingPeer | NonStreamingPeer ? hmm
// Probably yeah because then a non StreamingPeer doesn't even need a connection

export const isStreamingPeer = (p: Peer): p is StreamingPeer =>
  p.connection.channels.streaming.on === true;
