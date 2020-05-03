import { isLeft } from 'fp-ts/lib/Either';
import { SocketX } from 'src/lib/SocketX';
import {
  webrtcNegotationPayload,
  WebrtcNegotationPayload,
} from './records/SignalingPayload';
import { SignalingChannel, SignalingMessage } from './SignalingChannel';

export class WssSignalingChannel implements SignalingChannel {
  onmessage?: ((msg: SignalingMessage) => void);

  isOpen = false;

  constructor(public connection: SocketX, peerId: string) {
    this.connection.addEventListener('message', (event) => {
      if (typeof event.data !== 'string') {
        // TODO: Do something if not string
        return;
      }

      const payload = JSON.parse(event.data);
      const result = webrtcNegotationPayload.decode(payload);

      if (isLeft(result)) {
        return;
      }

      const msg = result.right;

      // If the msg is not for the given peer id stop here!
      // TODO: This can be done better from outside somehow, polimorphically!
      // Like calling the onmessage only on the right peer, but that's a bit more advanced
      //  and impractical for now
      if (msg.content.peer_id !== peerId) {
        return;
      }

      if (msg.msg_type === 'webrtc_negotiation') {
        this.onmessage?.(JSON.parse(result.right.content.forward));
      }
    });
  }

  // TODO: the peer id could be given from here too.
  send(peerId: string, forward: { [k: string]: unknown }) {
    const payload: WebrtcNegotationPayload = {
      msg_type: 'webrtc_negotiation',
      content: {
        peer_id: peerId,
        forward: JSON.stringify(forward),
      },
    };

    const msg = JSON.stringify(payload);

    this.connection.send(msg);
  }
}
