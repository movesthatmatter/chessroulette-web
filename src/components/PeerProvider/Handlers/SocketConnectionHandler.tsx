import { UserRecord } from 'dstnd-io';
import React from 'react';
import { Component, Dispatch } from 'react';
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
  user: UserRecord;
  peerProviderState: PeerProviderState;
  dispatch: Dispatch<any>;
  render: SocketConsumerProps['render'];
  onReady?: SocketConsumerProps['onReady'];
};

export class SocketConnectionHandler extends Component<Props> {
  render() {
    return (
      <SocketConsumer
        onReady={(socket) => {
          socket.send({
            kind: 'userIdentification',
            content: { userId: this.props.user.id },
          });

          if (this.props.onReady) {
            this.props.onReady(socket);
          }
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
