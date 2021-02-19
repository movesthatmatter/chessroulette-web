import { useContext } from 'react';
import { Peer, Room } from '../types';
import { PeerConnectionsErrors } from '../lib/PeerConnections';
import { PeerContext } from '../PeerContext';
import usePrevious from 'use-previous';
import { SocketClient } from 'src/services/socket/SocketClient';

export type PeerState =
  | {
      status: 'init';
    }
  | ({
      status: 'open';
      client: {
        onMessage: SocketClient['onMessage'];
        sendMessage: SocketClient['send'];
      };
      me: Peer;
    } & (
      | {
          hasJoinedRoom: true;
          room: Room;
          connected: boolean;
          connectToRoom: () => void;

          // This disconnects from the Peers in the room
          //  but doesn't leave – i.e. remains joined to the room
          disconnectFromRoom: () => void;

          // This leaves the room
          leaveRoom: () => void;
        }
      | {
          hasJoinedRoom: false;
        }
    ))
  | {
      status: 'closed';
      error?: PeerConnectionsErrors;
    }
  | {
      status: 'disconnected';
    };

// TODO: This should conincide to the context state and simply
//  be a proxy to it!
export const usePeerState = (): PeerState => {
  const context = useContext(PeerContext);
  const previousContextState = usePrevious(context.state);

  // On Previously Connected and now back to init
  if (
    context.state === 'init' &&
    (previousContextState === 'joined' || previousContextState === 'notJoined')
  ) {
    return {
      status: 'disconnected',
    };
  } else if (context.state === 'joined' || context.state === 'notJoined') {
    const client = {
      sendMessage: context.sendMessage.bind(context),
      onMessage: context.onMessage.bind(context),
    };

    return {
      status: 'open',
      client,
      me: context.me,
      ...(context.state === 'joined'
        ? {
            hasJoinedRoom: true,
            room: context.room,
            connected: context.connected,
            connectToRoom: context.connectToRoom,
            disconnectFromRoom: context.disconnectFromRoom,
            leaveRoom: context.leaveRoom,
          }
        : {
            hasJoinedRoom: false,
          }),
    };
  } else if (context.state === 'error') {
    return {
      status: 'closed',
      error: context.error,
    };
  }

  return {
    status: 'init',
  };
};
