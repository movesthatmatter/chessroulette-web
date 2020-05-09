import React from 'react';
import { PeerRecord } from 'dstnd-io';
import { SocketConsumer } from '../SocketProvider';
import { PeersProvider } from '../PeersProvider';
import { FaceTimeArea } from './FaceTimeArea';

type Props = {
  me: PeerRecord;
  peers: PeerRecord[];
};

export const FaceTimeAreaContainer: React.FC<Props> = (props) => (
  <SocketConsumer
    render={({ socket }) => (
      <PeersProvider
        me={props.me}
        peers={props.peers}
        onReady={({ connect }) => connect()}
        socket={socket}
        render={({
          peerConnections, startAVBroadcasting, localStream, stopAVBroadcasting,
        }) => (
          <FaceTimeArea
            me={props.me}
            localStream={localStream}
            peerConnections={Object.values(peerConnections)}
            startStreaming={startAVBroadcasting}
            stopStreaming={stopAVBroadcasting}
          />
        )}
      />
    )}
  />
);
