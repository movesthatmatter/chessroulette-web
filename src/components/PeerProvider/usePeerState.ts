import { useContext } from 'react';
import { Peer, Room } from '../RoomProvider';
import { PeerConnectionsErrors } from './PeerConnections';
import { PeerContext } from './PeerContext';
import { Proxy } from './Proxy';
import usePrevious from 'use-previous';
import { SocketClient } from 'src/services/socket/SocketClient';

export type PeerState =
  | {
      status: 'init';
    }
  | ({
      status: 'open';
      client: Proxy & {
        send: SocketClient['send'];
      };
      me: Peer;
    } & (
      | {
          hasJoinedRoom: true;
          room: Room;
          connected: boolean;
          connectToRoom: () => void;
          disconnectFromRoom: () => void;
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
    const client = Object.assign(context.proxy, {
      send: context.request,
    });

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
