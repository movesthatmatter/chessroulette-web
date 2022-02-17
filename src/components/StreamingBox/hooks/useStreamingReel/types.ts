import { UserRecord } from 'dstnd-io';
import { PeerStreamingConfigOn } from 'src/services/peers';

export type Streamer = {
  streamingConfig: PeerStreamingConfigOn;
  user: UserRecord;
};
export type StreamersMap = Record<Streamer['user']['id'], Streamer>;