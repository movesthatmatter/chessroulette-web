import { StreamingPeer, StreamingPeersMap } from '../../types';

export type StreamingPeersState =
  | {
      ready: false;
    }
  | {
      ready: true;
      streamersMap: StreamingPeersMap;
      inFocus: StreamingPeer;
      reel: StreamingPeer[];
      reelByUserId: Record<StreamingPeer['user']['id'], number>;
    };
