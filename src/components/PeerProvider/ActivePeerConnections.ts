import PeerSDK from 'peerjs';

export type ActivePeerConnection = {
  data?: PeerSDK.DataConnection;
  media?: {
    connection: PeerSDK.MediaConnection;
    localStream: MediaStream;
  };
}

export class ActivePeerConnections {
  private connections: Record<string, ActivePeerConnection> = {};

  add(peerId: string, apc: ActivePeerConnection) {
    this.connections[peerId] = {
      ...this.connections[peerId],
      ...apc,
    };
  }

  get(peerId: string) {
    return this.connections[peerId];
  }

  remove(peerId: string) {
    const pc = this.connections[peerId];

    if (!pc) {
      return;
    }

    // Stop the local shared stream
    pc.media?.localStream.getTracks().forEach((track) => {
      track.stop();
    });

    pc.media?.connection.close();
    pc.data?.close();

    // Remove the current apc
    const { [peerId]: removed, ...rest } = this.connections;

    this.connections = rest;
  }

  removeAll() {
    Object
      .keys(this.connections)
      .forEach((peerId) => this.remove(peerId));
  }
}
