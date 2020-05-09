
// @to deprecate in fovaor of ConnectedPeer
export type PeerStream = {
  peerId: string;
  stream: MediaStream;
}

export type PeerConnectionStatus = {
  peerId: string;
  channels: {
    data: {
      on: boolean;
    };
    streaming: {
      on: false;
    } | {
      on: true;
      type: 'audio' | 'video' | 'audio-video';
      stream: MediaStream;
    };
  };
};
