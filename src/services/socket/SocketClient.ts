import { getSocketXConnection, SocketX } from 'src/lib/SocketX';
import { Pubsy } from 'src/lib/Pubsy';
import {
  SocketPayload,
  socketPayload,
  io,
  MyStatsPayload,
  ConnectionOpenedPayload,
  PeerJoinedRoomPayload,
  PingPayload,
  UserIdentificationPayload,
  WhoamiRequestPayload,

  // Room
  JoinRoomRequestPayload,
  JoinRoomSuccessPayload,
  JoinedRoomUpdatedPayload,
  JoinRoomFailurePayload,
  LeaveRoomRequestPayload,

  // Chat
  BroadcastChatMessagePayload,

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
  GameOfferingCancelRequestPayload,
  GameStatusCheckRequestPayload,
  JoinedGameUpdatedPayload,
  GameChallengeOfferingRequestPayload,
  GameChallengeAcceptRequestPayload,
  GameChallengeDenyRequestPayload,
  GameTakebackOfferingRequestPayload,
  GameTakebackOfferingAcceptRequestPayload,
  GameTakebackOfferingDenyRequestPayload,
  AnalysisMoveRequestPayload,
  AnalysisRefocusRequestPayload,
  AnalysisDrawnShapesUpdatedRequestPayload,
} from 'dstnd-io';
import { PeerMessageEnvelope } from 'src/providers/PeerProvider/records';

type ReceivableMessagesMap = {
  peerJoinedRoom: PeerJoinedRoomPayload;
  myStats: MyStatsPayload;
  connectionOpened: ConnectionOpenedPayload;

  joinRoomSuccess: JoinRoomSuccessPayload;
  joinRoomFailure: JoinRoomFailurePayload;
  joinedRoomUpdated: JoinedRoomUpdatedPayload;

  ping: PingPayload;

  // Game
  joinedGameUpdatedPayload: JoinedGameUpdatedPayload;

  // This is the same as RTC Data, but over Socket for reliability
  peerMessage: {
    kind: 'peerMessage';
    content: PeerMessageEnvelope;
  };
};

type SendableMessagesMap = {
  userIdentification: UserIdentificationPayload;
  statsReaderIdentification: StatsReaderIdentificationPayload;
  ping: PingPayload;
  whoami: WhoamiRequestPayload;

  // Room
  joinRoomRequest: JoinRoomRequestPayload;
  leaveRoomRequest: LeaveRoomRequestPayload;

  //Chat
  broadcastChatMessage: BroadcastChatMessagePayload;

  // Game
  gameResignationRequestPayload: GameResignationRequestPayload;
  gameMoveRequestPayload: GameMoveRequestPayload;
  gameJoinRequestPayload: GameJoinRequestPayload;
  gameDrawOfferingRequestPayload: GameDrawOfferingRequestPayload;
  gameDrawAcceptRequestPayload: GameDrawAcceptRequestPayload;
  gameDrawDenyRequestPayload: GameDrawDenyRequestPayload;
  gameTakebackOfferingRequestPayload: GameTakebackOfferingRequestPayload;
  gameTakebackAcceptRequestPayload: GameTakebackOfferingAcceptRequestPayload;
  gameTakebackDenyRequestPayload: GameTakebackOfferingDenyRequestPayload;
  gameRematchOfferingRequestPayload: GameRematchOfferingRequestPayload;
  gameRematchDenyRequestPayload: GameRematchDenyRequestPayload;
  gameRematchAcceptRequestPayload: GameRematchAcceptRequestPayload;
  gameAbortionRequestPayload: GameAbortionRequestPayload;
  gameOfferingCancelRequestPayload: GameOfferingCancelRequestPayload;
  gameStatusCheckRequestPayload: GameStatusCheckRequestPayload;

  gameChallengeOfferingRequestPayload: GameChallengeOfferingRequestPayload;
  gameChallengeAcceptRequestPayload: GameChallengeAcceptRequestPayload;
  gameChallengeDenyRequestPayload: GameChallengeDenyRequestPayload;

  // Analysis
  analysisMoveRequestPayload: AnalysisMoveRequestPayload;
  analysisRefocusRequestPayload: AnalysisRefocusRequestPayload;
  analysisDrawnShapesUpdatedRequestPayload: AnalysisDrawnShapesUpdatedRequestPayload;

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
      io.toResult(socketPayload.decode(JSON.parse(data))).map((msg) => {
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
          case 'joinedRoomUpdated':
            this.pubsy.publish('joinedRoomUpdated', msg);
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
    fn: (p: ReceivableMessagesMap[K]) => unknown
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
