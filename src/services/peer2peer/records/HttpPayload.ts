import * as io from 'io-ts';
import { peerNetworkRefreshPayloadContent } from './SignalingPayload';

// @Deprecate this most likely
export const joinRoomRequestPayload = io.type({
  room_id: io.string,
  peer_id: io.string,
});

export const joinRoomResponsePayload = peerNetworkRefreshPayloadContent;

export type JoinRoomRequestPayloadRecord = io.TypeOf<
  typeof joinRoomRequestPayload
>;
export type JoinRoomResponsePayloadRecord = io.TypeOf<
  typeof joinRoomResponsePayload
>;
