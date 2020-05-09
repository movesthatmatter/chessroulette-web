import { SocketX } from 'src/lib/SocketX';
import {
  WebrtcNegotationPayload,
  SignalingPayload,
  signalingPayload,
  WebrtcInvitationPayload,
  WebrtcRefusalPayload,
  io,
} from 'dstnd-io';
import { Pubsy } from 'src/lib/Pubsy';

export type SignalingMessageWithDescription = {
  desc: RTCSessionDescription;
  candidate?: never;
};

export type SignalingMessageWithCandidate = {
  candidate: RTCIceCandidate;
  desc?: never;
};

export type SignalingNegotiationMessage =
  | SignalingMessageWithDescription
  | SignalingMessageWithCandidate;

type MessagesPayloadMap = {
  invitation: WebrtcInvitationPayload;
  negotiation: WebrtcNegotationPayload;
  refusal: WebrtcRefusalPayload;
};

export class RTCSignalingChannel {
  private pubsy = new Pubsy<
  {
    onMessage: SignalingPayload;
  } & MessagesPayloadMap
  >();

  isOpen = false;

  constructor(public connection: SocketX) {
    this.connection.addEventListener('message', ({ data }) => {
      io.deserialize(signalingPayload, JSON.parse(data)).map((msg) => {
        switch (msg.kind) {
          case 'webrtcInvitation':
            this.pubsy.publish('invitation', msg);
            break;
          case 'webrtcNegotiation':
            this.pubsy.publish('negotiation', msg);
            break;
          case 'webrtcRefusal':
            this.pubsy.publish('onMessage', msg);
            break;
          default:
            break;
        }

        this.pubsy.publish('onMessage', msg);
      });
    });
  }

  send(payload: SignalingPayload) {
    this.connection.send(JSON.stringify(payload));
  }

  negotiateConnection(peerId: string, forwardMessage: SignalingNegotiationMessage) {
    this.send({
      kind: 'webrtcNegotiation',
      content: {
        peerId,
        forward: forwardMessage,
      },
    });
  }

  onMessageType<K extends keyof MessagesPayloadMap>(
    type: K,
    fn: (p: MessagesPayloadMap[K]) => unknown,
  ) {
    return this.pubsy.subscribe(type, fn);
  }

  onMessage(fn: (msg: SignalingPayload) => unknown) {
    return this.pubsy.subscribe('onMessage', fn);
  }
}
