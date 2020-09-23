// @to deprecate in fovaor of ConnectedPeer
export type PeerStream = {
  peerId: string;
  stream: MediaStream;
}

export type PeerStreamingConfigOn = {
  on: true;
  type: 'audio' | 'video' | 'audio-video';
  stream: MediaStream;
}

export type PeerStreamingConfigOff = {
  on: false;
}

export type PeerStreamingConfig = PeerStreamingConfigOn | PeerStreamingConfigOff;

export type PeerConnectionStatus = {
  peerId: string;
  channels: {
    data: {
      on: boolean;
    };
    streaming: PeerStreamingConfig;
  };
};
