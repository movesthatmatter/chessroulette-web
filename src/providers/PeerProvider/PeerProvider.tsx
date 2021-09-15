import { IceServerRecord, UserRecord } from 'dstnd-io';
import React from 'react';
import { PeerContext, PeerContextState } from './PeerContext';
import { PeerConnectionsHandler, PeerConnectionsState } from './Handlers';
import { Dispatch } from 'redux';
import { SocketReceivableMessage } from '../SocketProvider/types';
import {
  addPeerStream,
  closePeerChannelsAction,
  createMeAction,
  createRoomAction,
  removeMeAction,
  updateMeAction,
  updateRoomAction,
} from './redux/actions';
import { State as PeerProviderState } from './redux/reducer';
import { SocketClient } from 'src/services/socket/SocketClient';
import { RoomCredentials } from './types';

type Props = {
  user: UserRecord;
  iceServers: IceServerRecord[];
  dispatch: Dispatch;
  roomAndMe: PeerProviderState;
  socketClient: SocketClient;
};

type State = {
  peerConnectionsState: PeerConnectionsState;
  contextState: PeerContextState;
};

export class PeerProvider extends React.Component<Props, State> {
  private eventUnsubscribers: (() => void)[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      peerConnectionsState: { status: 'init' },
      contextState: { status: 'init' },
    };
  }

  componentDidMount() {
    this.setupSocketHandler();
  }

  componentWillUnmount() {
    this.destroySocketHandler();
  }

  private setupSocketHandler() {
    this.eventUnsubscribers = [
      this.props.socketClient.onMessage((msg) => this.onMessageHandler(msg)),
      this.props.socketClient.onClose(() => this.props.dispatch(removeMeAction())),
    ];
  }

  private destroySocketHandler() {
    this.eventUnsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  private onMessageHandler(msg: SocketReceivableMessage) {
    if (msg.kind === 'iam') {
      if (!this.props.roomAndMe.me) {
        this.props.dispatch(
          createMeAction({
            me: msg.content.peer,
            joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
          })
        );
      } else {
        this.props.dispatch(
          updateMeAction({
            me: msg.content.peer,
            joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
          })
        );
      }
    } else if (msg.kind === 'joinedRoomUpdated') {
      this.props.dispatch(updateRoomAction({ room: msg.content }));
    } else if (msg.kind === 'joinedRoomAndGameUpdated') {
      this.props.dispatch(updateRoomAction({ room: msg.content.room }));
    } else if (msg.kind === 'joinRoomSuccess') {
      this.props.dispatch(
        createRoomAction({
          room: msg.content.room,
          me: msg.content.me,
        })
      );
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !(
        prevProps.roomAndMe === this.props.roomAndMe &&
        prevState.peerConnectionsState === this.state.peerConnectionsState
      )
    ) {
      this.setState({ contextState: this.getNextContextState(prevState.contextState) });
    }
  }

  private getNextContextState(prev: State['contextState']): PeerContextState {
    if (!this.props.roomAndMe.me) {
      return { status: 'init' };
    }

    // TODO: Not sure this works correctly
    if (this.state.peerConnectionsState.status === 'closed') {
      return {
        status: 'closed',
      };
    }

    if (this.props.roomAndMe.room) {
      return {
        status: 'open',
        client: this.props.socketClient,
        me: this.props.roomAndMe.me,
        room: this.props.roomAndMe.room,
        hasJoinedRoom: true,
        connected:
          this.state.peerConnectionsState.status === 'ready' &&
          this.state.peerConnectionsState.connected,
        connectToRoom: this.connectToRoom.bind(this),
        disconnectFromRoom: this.disconnectFromRoom.bind(this),
        leaveRoom: this.leaveRoom.bind(this),
      };
    }

    return {
      status: 'open',
      client: this.props.socketClient,
      me: this.props.roomAndMe.me,
      hasJoinedRoom: false,
      joinRoom: this.joinRoom.bind(this),
    };
  }

  private connectToRoom() {
    if (this.state.peerConnectionsState.status === 'ready' && this.props.roomAndMe.room?.peers) {
      this.state.peerConnectionsState.connect(this.props.roomAndMe.room.peers);
    }
  }
  private disconnectFromRoom() {
    if (this.state.peerConnectionsState.status === 'ready') {
      this.state.peerConnectionsState.disconnect();
    }
  }
  private leaveRoom() {
    if (this.state.peerConnectionsState.status === 'ready') {
      this.state.peerConnectionsState.destroy();
    }

    this.props.socketClient.send({
      kind: 'leaveRoomRequest',
      content: undefined,
    });
  }

  private joinRoom(credentials: RoomCredentials) {
    this.props.socketClient.send({
      kind: 'joinRoomRequest',
      content: {
        roomId: credentials.id,
        code: credentials.code,
      },
    });
  }

  render() {
    return (
      <>
        <PeerConnectionsHandler
          onPeerStream={(p) => this.props.dispatch(addPeerStream(p))}
          onPeerDisconnected={(peerId) => {
            this.props.dispatch(closePeerChannelsAction({ peerId }));
          }}
          iceServers={this.props.iceServers}
          user={this.props.user}
          onStateUpdate={(peerConnectionsState) => this.setState({ peerConnectionsState })}
        />
        {this.state.peerConnectionsState.status === 'ready' && (
          <PeerContext.Provider value={this.state.contextState}>
            {this.props.children}
          </PeerContext.Provider>
        )}
      </>
    );
  }
}
