import { Pubsy } from 'src/lib/Pubsy';
import { PeerMessageEnvelope } from './records';

export class Proxy {
  private pubsy = new Pubsy<{
    onPeerMessageReceived: PeerMessageEnvelope;
    onPeerMessageSent: PeerMessageEnvelope;
  }>();

  onPeerMessageReceived(fn: (msg: PeerMessageEnvelope) => void) {
    return this.pubsy.subscribe('onPeerMessageReceived', fn);
  }

  onPeerMessageSent(fn: (msg: PeerMessageEnvelope) => void) {
    return this.pubsy.subscribe('onPeerMessageSent', fn);
  }

  publishOnPeerMessageReceived(msg: PeerMessageEnvelope) {
    this.pubsy.publish('onPeerMessageReceived', msg);
  }

  publishOnPeerMessageSent(msg: PeerMessageEnvelope) {
    this.pubsy.publish('onPeerMessageSent', msg);
  }
}
