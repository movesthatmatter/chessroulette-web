import { GuestUserRecord } from 'dstnd-io';
import React from 'react';
import { Component, Dispatch } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { SocketConsumer, SocketConsumerProps } from '../../SocketProvider';
import {
  createMeAction,
  createRoomAction,
  removeMeAction,
  updateMeAction,
  updateRoomAction,
} from '../redux/actions';
import { State as PeerProviderState } from '../redux/reducer';

type Props = {
  peerProviderState: PeerProviderState;
  dispatch: Dispatch<any>;
  render: SocketConsumerProps['render'];
  onReady?: SocketConsumerProps['onReady'];
} & ({
  isGuest: true;
  guestUser: GuestUserRecord;
} | {
  isGuest: false;
  accessToken: string;
});

export class SocketConnectionHandler extends Component<Props> {
  private socketRef?: SocketClient;

  componentDidUpdate(prevProps: Props) {
    if (!this.socketRef) {
      return;
    }

    if (
      prevProps.isGuest !== this.props.isGuest // If the Guest flag has changed
      // If the Guest User Id has changed
      || (prevProps.isGuest && this.props.isGuest && prevProps.guestUser.id !== this.props.guestUser.id)
      // If the Access Token has changed
      || (!prevProps.isGuest && !this.props.isGuest && prevProps.accessToken !== this.props.accessToken)
    ) {
      this.identify(this.socketRef);
    }
  }

  private identify(socket: SocketClient) {
    socket.send({
      kind: 'userIdentification',
      content: {
        ...this.props.isGuest ? {
          isGuest: true,
          guestUserId: this.props.guestUser.id,
        } : {
            isGuest: false,
            acessToken: this.props.accessToken,
          },
      },
    });
  }

  render() {
    return (
      <SocketConsumer
        onReady={(socket) => {
          this.identify(socket);

          if (this.props.onReady) {
            this.props.onReady(socket);
          }

          this.socketRef = socket;
        }}
        onClose={() => this.props.dispatch(removeMeAction())}
        onMessage={(msg) => {
          const { dispatch } = this.props;

          if (msg.kind === 'iam') {
            if (!this.props.peerProviderState.me) {
              dispatch(
                createMeAction({
                  me: msg.content.peer,
                  joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
                })
              );
            } else {
              dispatch(
                updateMeAction({
                  me: msg.content.peer,
                  joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
                })
              );
            }
          } else if (msg.kind === 'joinedRoomUpdated') {
            dispatch(updateRoomAction({ room: msg.content }));
          } else if (msg.kind === 'joinedRoomAndGameUpdated') {
            dispatch(updateRoomAction({ room: msg.content.room }));
          } else if (msg.kind === 'joinRoomSuccess') {
            dispatch(
              createRoomAction({
                room: msg.content.room,
                me: msg.content.me,
              })
            );
          }
        }}
        render={(...args) => this.props.render(...args)}
      />
    );
  }
}
