import * as io from 'io-ts';

export const peerMessageEnvelope = io.type({
  fromPeerId: io.string,
  toPeerId: io.string,

  // This stayis unknown at this lower level
  message: io.unknown,

  // TODO: make UTCDatetime
  timestamp: io.string,
});

export type PeerMessageEnvelope<
  TMessage = unknown
> = io.TypeOf<typeof peerMessageEnvelope> & {message: TMessage};
