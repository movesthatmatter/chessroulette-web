/* eslint-disable @typescript-eslint/no-unused-expressions */

import { RTCDataX } from 'src/lib/RTCDataX';
import { Result, Err, Ok } from 'ts-results';
import { isLeft } from 'fp-ts/lib/Either';
import { logsy } from 'src/lib/logsy';
import {
  PeerMessageEnvelope,
  peerMessageEnvelope,
} from './records/PeerMessagingEnvelopePayload';

export class PeerMessageHandler {
  private unsubscribers: Function[] = [];

  onMesssage?: (msg: PeerMessageEnvelope) => void;

  constructor(private dataChannel: RTCDataX, private peerId: string) {
    const onDataHandler = (event: MessageEvent) => {
      try {
        const result = peerMessageEnvelope.decode(JSON.parse(event.data));

        if (isLeft(result)) {
          logsy.error(
            '[PeerMessageHandler][DataChannelMessageHandler] Message Decoding Error',
            event.data,
          );

          return;
        }

        this.onMesssage?.(result.right);
        // this.pubsy.publish('onData', result.right);
      } catch (e) {
        logsy.error(
          '[PeerMessageHandler] DataChannelMessageHandler: Message JSON Parsing Error',
          event.data,
          e,
        );
      }
    };

    dataChannel.addEventListener('message', onDataHandler);

    this.unsubscribers.push(() => dataChannel.removeEventListener('message', onDataHandler));
  }

  send(
    msg: Pick<PeerMessageEnvelope, 'fromPeerId' | 'message'>,
  ): Result<PeerMessageEnvelope, unknown> {
    // Return an Err if the data channel somehow is not ready

    const msgPayload: PeerMessageEnvelope = {
      ...msg,
      timestamp: String(new Date().getTime()),
      toPeerId: this.peerId,
    };

    this.dataChannel.send(JSON.stringify(msgPayload));

    // Return the msgPayload to prove it was sent OK
    return new Ok(msgPayload);
  }

  // This must be called when the class is "de constructed" - when it's ready
  //  to be garbaged collected
  releaseListeners() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
  }
}
