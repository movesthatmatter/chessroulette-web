import * as io from 'io-ts';

export const peerMessage = io.type({
  fromPeerId: io.string,
  toPeerId: io.string,
  content: io.string,

  // TODO: make UTCDatetime
  timestamp: io.string,
});

export type PeerMessage = io.TypeOf<typeof peerMessage>;
