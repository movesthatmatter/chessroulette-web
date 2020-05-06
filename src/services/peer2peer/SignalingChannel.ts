// export type SignalingMessage = {
//   peer_id: string;
//   content: SignalingMessageWithDescription | SignalingMessageWithCandidate;
// }

// export type SignalingNegotiationMessage =
//   | SignalingMessageWithDescription
//   | SignalingMessageWithCandidate;

// export type SignalingMessageWithDescription = {
//   desc: RTCSessionDescription;
//   candidate?: null;
// };

// export type SignalingMessageWithCandidate = {
//   candidate: RTCIceCandidate;
//   desc?: null;
// };

// // export interface SignalingChannel {
// //   send(peerId: string, forward: {[k: string]: unknown}): void;

// //   sendNegotationMessage?: (peerId: string)

// //   // @Deprecate in favor of the more specific onNegotationMessage
// //   onmessage?: ((msg: SignalingMessage) => void) | undefined;

// //   onNegotationMessage?: ((msg: SignalingMessage) => void) | undefined;
// // }
