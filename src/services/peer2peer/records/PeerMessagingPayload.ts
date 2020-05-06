import * as io from 'io-ts';

const peerMessageDefaults = io.type({
  fromPeerId: io.string,
  toPeerId: io.string,

  // TPDP: Not sure this should be serialized or not.
  //  If serialized it could come as string, but even that
  //  isn't enough information since the content could actually
  //  be a legit string - so maybe a deserialized unknown is OK
  //  Once it's used in more specific context it can be further decoded
  content: io.unknown,

  // TODO: make UTCDatetime
  timestamp: io.string,
});

const peerChatPayload = io.intersection([
  peerMessageDefaults,
  io.type({
    msgType: io.literal('chat'),
  }),
]);

const gameDataPayload = io.intersection([
  peerMessageDefaults,
  io.type({
    msgType: io.literal('gameData'),
  }),
]);

export const peerMessage = io.union([
  peerChatPayload,
  gameDataPayload,
]);
export type PeerMessage = io.TypeOf<typeof peerMessage>;
