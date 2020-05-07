import * as io from 'io-ts';
import { peerRecord } from 'dstnd-io';

export const chatMessageRecord = io.type({
  msgType: io.literal('chatMessage'),
  content: io.string,
  from: peerRecord,
});

export type ChatMessageRecord = io.TypeOf<typeof chatMessageRecord>;
