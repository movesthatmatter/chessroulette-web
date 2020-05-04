import * as io from 'io-ts';

// TODO: Move from services/peer2peer somewhere els as it doesn't belong here anymore


export const peerMessage = io.type({
  fromPeerId: io.string,
  toPeerId: io.string,
  content: io.string,

  // TODO: make UTCDatetime
  timestamp: io.string,
});

export type PeerMessage = io.TypeOf<typeof peerMessage>;
