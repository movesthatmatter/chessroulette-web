import { Peer } from '../../types';

export const getPeerStatusInfo = (peer?: Peer) => {
  if (!peer) {
    return 'Not Online';
  }

  if (peer.hasJoinedRoom) {
    if (peer.connection.channels.streaming.on) {
      return 'Streaming';
    }

    if (peer.connection.channels.data.on) {
      return 'Online';
    }

    return 'Joining';
  }

  return 'Not In The Room';
};
