import { getSocketXConnection, SocketX } from 'src/lib/SocketX';
import { Pubsy } from 'src/lib/Pubsy';
import {
  SocketPayload,
  socketPayload,
  io,
  MyStatsPayload,
  RoomStatsPayload,
  ConnectionOpenedPayload,
  PeerJoinedRoomPayload,
  JoinRoomRequestPayload,
  JoinRoomSuccessPayload,
} from 'dstnd-io';

type ReceivableMessagesMap = {
  peerJoinedRoom: PeerJoinedRoomPayload;
  myStats: MyStatsPayload;
  roomStats: RoomStatsPayload;
  connectionOpened: ConnectionOpenedPayload;

  joinRoomSuccess: JoinRoomSuccessPayload;
}

type SendableMessagesMap = {
  joinRoomRequest: JoinRoomRequestPayload;
}

export class SocketClient {
  private pubsy = new Pubsy<{
    onReady: null;
    onMessage: SocketPayload;
  } & ReceivableMessagesMap>();

  public connection: SocketX;

  constructor(url?: string) {
    this.connection = getSocketXConnection(url);

    this.connection.addEventListener('message', ({ data }) => {
      io
        .deserialize(socketPayload, JSON.parse(data))
        .map((msg) => {
        // I don't like this at all but there's no way to map
        //  the types to the message in a clean way in typescript
        //  as it doesn't (yet) support mapping by tagged union kinds
        // See: https://github.com/microsoft/TypeScript/issues/30581
          switch (msg.kind) {
            case 'connectionOpened':
              this.pubsy.publish('connectionOpened', msg);
              break;
            case 'peerJoinedRoom':
              this.pubsy.publish('peerJoinedRoom', msg);
              break;
            case 'roomStats':
              this.pubsy.publish('roomStats', msg);
              break;
            case 'myStats':
              this.pubsy.publish('myStats', msg);
              break;
            case 'joinRoomSuccess':
              this.pubsy.publish('joinRoomSuccess', msg);
              break;
            default:
              break;
          }

          this.pubsy.publish('onMessage', msg);
        });
    });
  }

  close() {
    this.connection.close();
  }

  send<K extends keyof SendableMessagesMap>(payload: SendableMessagesMap[K]) {
    this.connection.send(JSON.stringify(payload));
  }

  onMessageType<
    K extends keyof ReceivableMessagesMap
  >(msg: K, fn: (p: ReceivableMessagesMap[K]) => unknown) {
    return this.pubsy.subscribe(msg, fn);
  }

  onMessage(fn: (msg: SocketPayload) => unknown) {
    return this.pubsy.subscribe('onMessage', fn);
  }
}