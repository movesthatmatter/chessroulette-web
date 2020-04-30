export type SignalingMessage = {
  peer_id: string;
} & (
  | SignalingMessageWithDescription
  | SignalingMessageWithCandidate
);

export type SignalingMessageWithDescription = {
  desc: RTCSessionDescription;
  candidate?: null;
};

export type SignalingMessageWithCandidate = {
  candidate: RTCIceCandidate;
  desc?: null;
};

export interface SignalingChannel {
  send(peerId: string, forward: {[k: string]: unknown}): void;

  onmessage: ((msg: SignalingMessage) => void) | null;
}
