import * as io from 'io-ts';
import { isoDateTimeFromISOString } from 'src/lib/date';
import { peerRecord, userRecord } from 'dstnd-io';

export const peerMessageEnvelope = io.type({
  // This stays unknown at this level
  message: io.unknown,

  timestamp: isoDateTimeFromISOString,
});
export type PeerMessageEnvelope<
  TMessage = unknown
> = io.TypeOf<typeof peerMessageEnvelope> & {message: TMessage};

export const peerConnectionMetadata = io.type({
  user: userRecord,
});
export type PeerConnectionMetadata = io.TypeOf<typeof peerConnectionMetadata>;
