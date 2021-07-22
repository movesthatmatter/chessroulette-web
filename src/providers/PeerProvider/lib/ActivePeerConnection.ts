import { PeerRecord } from 'dstnd-io';
import { Pubsy } from 'src/lib/Pubsy';
import { peerMessageEnvelope, PeerMessageEnvelope } from '../records';
import PeerSDK from 'peerjs';
import { logsy } from 'src/lib/logsy';
import { eitherToResult } from 'src/lib/ioutil';
import { getAVStreaming } from 'src/services/AVStreaming';

type Events = {
  onOpen: undefined;
  onClose: undefined;
  onStream: MediaStream;
  onMessage: PeerMessageEnvelope;
  onError: unknown;
};

export class ActivePeerConnection {
  private pubsy = new Pubsy<Events>();

  private AVStreaming = getAVStreaming();

  private myStream?: MediaStream;

  private unsubscribers: Partial<Record<keyof Events, () => void>> = {};

  constructor(public peerId: PeerRecord['id'], private connection: PeerSDK.DataConnection) {
    // On Open Event
    const onOpenHandler = () => {
      logsy.info('[ActivePeerConnection] with Peer:', peerId, 'Connection Opened.');
      this.pubsy.publish('onOpen', undefined);
    };

    connection.on('open', onOpenHandler);

    this.unsubscribers.onOpen = () => connection.off('open', onOpenHandler);

    // On Error Event
    const onErrorHandler = (e: unknown) => {
      logsy.error('[ActivePeerConnection] with Peer:', peerId, 'Error:', e);

      this.pubsy.publish('onError', e);
    };

    connection.on('error', onErrorHandler);

    this.unsubscribers.onError = () => connection.off('error', onErrorHandler);

    // On Data Event
    const onDataHandler = (data: string) => {
      eitherToResult(peerMessageEnvelope.decode(JSON.parse(data)))
        .map((msg) => {
          this.pubsy.publish('onMessage', msg);
        })
        .mapErr(() => {
          logsy.error(
            '[ActivePeerConnection] with Peer:',
            peerId,
            'OnMessageHandler Decoding Error',
            data
          );
        });
    };

    connection.on('data', onDataHandler);

    this.unsubscribers.onMessage = () => connection.off('data', onDataHandler);

    // On Close Event
    const onCloseHandler = () => {
      logsy.info('[ActivePeerConnection] with Peer:', peerId, 'Connection Closed.');

      this.removeMyStream();

      this.pubsy.publish('onClose', undefined);
    };

    connection.on('close', onCloseHandler);

    this.unsubscribers.onClose = () => connection.off('close', onCloseHandler);
  }

  async getMyStream() {
    return this.AVStreaming.getStream().then((stream) => {
      this.myStream = stream;

      return stream;
    });
  }

  private removeMyStream() {
    if (this.myStream) {
      this.AVStreaming.destroyStreamById(this.myStream.id);
      this.myStream = undefined;
    }
  }

  sendMessage(msg: PeerMessageEnvelope) {
    this.connection.dataChannel.send(JSON.stringify(msg));
  }

  onOpen(fn: () => void) {
    return this.pubsy.subscribe('onOpen', fn);
  }

  onClose(fn: () => void) {
    return this.pubsy.subscribe('onClose', fn);
  }

  onStream(fn: (s: MediaStream) => void) {
    return this.pubsy.subscribe('onStream', fn);
  }

  onMessage(fn: (msg: PeerMessageEnvelope) => void) {
    return this.pubsy.subscribe('onMessage', fn);
  }

  onError(fn: (e: unknown) => void) {
    return this.pubsy.subscribe('onError', fn);
  }

  destroy() {
    this.connection.close();

    Object.values(this.unsubscribers).forEach((unsubscribe) => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    logsy.info('[ActivePeerConnection] with Peer:', this.peerId, 'Destroyed.');
  }
}
