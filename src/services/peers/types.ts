
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
    audio: {
      on: false;
    } | {
      on: true;
      tracks: MediaStreamTrack[];
    };
    video: {
      on: false;
    } | {
      on: true;
      tracks: MediaStreamTrack[];
    };
  };
};
