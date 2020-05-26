import * as io from 'io-ts';
import { isoDateTimeFromISOString } from 'src/lib/date';

export const peerMessageEnvelope = io.type({
  // This stays unknown at this level
  message: io.unknown,

  timestamp: isoDateTimeFromISOString,
});

export type PeerMessageEnvelope<
  TMessage = unknown
> = io.TypeOf<typeof peerMessageEnvelope> & {message: TMessage};
