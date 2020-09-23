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
  PingPayload,
  JoinRoomFailurePayload,
  UserIdentificationPayload,
  WhoAmIRequestPayload,

  // Game Logic
  GameResignationRequestPayload,
  GameMoveRequestPayload,
  GameJoinRequestPayload,
  GameDrawOfferingRequestPayload,
  GameDrawAcceptRequestPayload,
  GameDrawDenyRequestPayload,
  GameRematchOfferingRequestPayload,
  GameRematchDenyRequestPayload,
  GameRematchAcceptRequestPayload,
  GameAbortionRequestPayload,
  StatsReaderIdentificationPayload,
} from 'dstnd-io';
import { PeerMessageEnvelope } from 'src/components/PeerProvider/records';

type ReceivableMessagesMap = {
  peerJoinedRoom: PeerJoinedRoomPayload;
  myStats: MyStatsPayload;
  roomStats: RoomStatsPayload;
  connectionOpened: ConnectionOpenedPayload;

  joinRoomSuccess: JoinRoomSuccessPayload;
  joinRoomFailure: JoinRoomFailurePayload;

  ping: PingPayload;

  // This is the same as RTC Data, but over Socket for reliability
  peerMessage: {
    kind: 'peerMessage';
    content: PeerMessageEnvelope;
  };
};

type SendableMessagesMap = {
  joinRoomRequest: JoinRoomRequestPayload;
  userIdentification: UserIdentificationPayload;
  statsReaderIdentification: StatsReaderIdentificationPayload;
  ping: PingPayload;
  whoami: WhoAmIRequestPayload;

  // Game
  gameResignationRequestPayload: GameResignationRequestPayload;
  gameMoveRequestPayload: GameMoveRequestPayload;
  gameJoinRequestPayload: GameJoinRequestPayload;
  gameDrawOfferingRequestPayload: GameDrawOfferingRequestPayload;
  gameDrawAcceptRequestPayload: GameDrawAcceptRequestPayload;
  gameDrawDenyRequestPayload: GameDrawDenyRequestPayload;
  gameRematchOfferingRequestPayload: GameRematchOfferingRequestPayload;
  gameRematchDenyRequestPayload: GameRematchDenyRequestPayload;
  gameRematchAcceptRequestPayload: GameRematchAcceptRequestPayload;
  gameAbortionRequestPayload: GameAbortionRequestPayload;

  // This is the same as RTC Data, but over Socket for reliability
  peerMessage: {
    kind: 'peerMessage';
    content: PeerMessageEnvelope;
  };
};

export class SocketClient {
  private pubsy = new Pubsy<
  {
    onReady: null;
    onMessage: SocketPayload;
    onClose: null;
  } & ReceivableMessagesMap
  >();

  public connection: SocketX;

  constructor(url?: string) {
    this.connection = getSocketXConnection(url);

    this.connection.addEventListener('close', () => {
      this.pubsy.publish('onClose', null);
    });

    this.connection.addEventListener('message', ({ data }) => {
      io.toResult(socketPayload.decode(JSON.parse(data)))
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
            case 'joinRoomFailure':
              this.pubsy.publish('joinRoomFailure', msg);
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

  onMessageType<K extends keyof ReceivableMessagesMap>(
    msg: K,
    fn: (p: ReceivableMessagesMap[K]) => unknown,
  ) {
    return this.pubsy.subscribe(msg, fn);
  }

  onMessage(fn: (msg: SocketPayload) => unknown) {
    return this.pubsy.subscribe('onMessage', fn);
  }

  onClose(fn: () => void) {
    return this.pubsy.subscribe('onClose', fn);
  }
}
