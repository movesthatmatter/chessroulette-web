import { useContext } from 'react';
import { Peer, Room } from '../RoomProvider';
import { PeerConnectionsErrors } from './PeerConnections';
import { PeerContext } from './PeerContext';
import { Proxy } from './Proxy';
import usePrevious from 'use-previous';

export type PeerState =
  | {
      status: 'init';
    }
  | {
      status: 'open';
      client: Proxy;
      me: Peer;
      room?: Room;
    }
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
  if (context.state === 'init' && (previousContextState === 'joined' || previousContextState === 'notJoined')) {
    return {
      status: 'disconnected',
    }
  }
  else if (context.state === 'joined' || context.state === 'notJoined') {
    return {
      status: 'open',
      client: context.proxy,
      me: context.me,
      room: context.state === 'joined' ? context.room : undefined,
    }
  } else if (context.state === 'error') {
    return {
      status: 'closed',
      error: context.error,
    };
  }

  return {
    status: 'init',
  }
};
