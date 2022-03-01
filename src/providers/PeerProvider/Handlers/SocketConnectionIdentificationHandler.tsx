import { AccessToken, GuestUserRecord, JWTToken } from 'chessroulette-io';
import React from 'react';
import { Component } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { SocketConsumer, SocketConsumerProps } from '../../SocketProvider';

type Props = {
  onReady?: NonNullable<SocketConsumerProps['onReady']>;
  onMessage?: NonNullable<SocketConsumerProps['onMessage']>;
  onClose?: NonNullable<SocketConsumerProps['onClose']>;
  render: SocketConsumerProps['render'];
} & (
  | {
      isGuest: true;
      guestUser: GuestUserRecord;
    }
  | {
      isGuest: false;
      authenticationToken: JWTToken;
    }
);

export class SocketConnectionIdentificationHandler extends Component<Props> {
  private socketRef?: SocketClient;

  componentDidUpdate(prevProps: Props) {
    if (!this.socketRef) {
      return;
    }

    if (
      // If the Guest flag has changed
      prevProps.isGuest !== this.props.isGuest ||
      // If the Guest User Id has changed
      (prevProps.isGuest &&
        this.props.isGuest &&
        prevProps.guestUser.id !== this.props.guestUser.id) ||
      // If the Access Token has changed
      (!prevProps.isGuest &&
        !this.props.isGuest &&
        prevProps.authenticationToken !== this.props.authenticationToken)
    ) {
      this.identify(this.socketRef);
    }
  }

  private identify(socket: SocketClient) {
    socket.send({
      kind: 'userIdentification',
      content: {
        ...(this.props.isGuest
          ? {
              isGuest: true,
              guestUserId: this.props.guestUser.id,
            }
          : {
              isGuest: false,
              authenticationToken: this.props.authenticationToken,
            }),
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
        onMessage={(...args) => {
          if (this.props.onMessage) {
            this.props.onMessage(...args);
          }
        }}
        onClose={(...args) => {
          if (this.props.onClose) {
            this.props.onClose(...args);
          }
        }}
        render={(...args) => this.props.render(...args)}
      />
    );
  }
}
