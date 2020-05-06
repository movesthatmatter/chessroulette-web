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
  joinRoom: JoinRoomRequestPayload;
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
        // .mapErr((e) => {
        //   console.log('SocketClient Deserialize error', e);
        // })
        .map((msg) => {
        // I don't like this at all but there's no way to map
        //  the types to the message in a clean way in typescript
        //  as it doesn't (yet) support mapping by tagged union kinds
        // See: https://github.com/microsoft/TypeScript/issues/30581
          switch (msg.msg_type) {
            case 'connection_opened':
              this.pubsy.publish('connectionOpened', msg);
              break;
            case 'peer_joined_room':
              this.pubsy.publish('peerJoinedRoom', msg);
              break;
            case 'room_stats':
              this.pubsy.publish('roomStats', msg);
              break;
            case 'my_stats':
              this.pubsy.publish('myStats', msg);
              break;
            case 'join_room_success':
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

  send<
    TType extends keyof SendableMessagesMap,
  >(type: TType, content: SendableMessagesMap[TType]['content']) {
    // TODO: make this simpler
    if (type === 'joinRoom') {
      const payload: JoinRoomRequestPayload = {
        msg_type: 'join_room_request',
        content,
      };

      this.connection.send(JSON.stringify(payload));
    }
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
