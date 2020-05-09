import React from 'react';
import { PeerRecord } from 'dstnd-io';
import { PeersProvider } from '../PeersProvider';
import { SocketConsumer } from '../SocketProvider';
import { ChatBoxContainer } from './ChatBoxContainer';

type Props = {
  me: PeerRecord;
  peers: PeerRecord[];
};

export const PeerChatBoxContainer: React.FC<Props> = (props) => (
  <SocketConsumer
    render={({ socket }) => (
      <PeersProvider
        me={props.me}
        peers={props.peers}
        socket={socket}
        onReady={(client) => {
          client.connect();
        }}
        render={({ broadcastMessage }) => (
          <div>
            <div>
              {`Me: ${props.me.name}`}
            </div>
            <div>
              {'Peers: '}
              {props.peers.map((peer) => (
                <span key={peer.id}>
                  {peer.name}
                  {' '}
                  |
                  {' '}
                </span>
              ))}
            </div>
            <ChatBoxContainer
              me={props.me}
              broadcastMessage={broadcastMessage}
            />
          </div>
        )}
      />
    )}
  />
);
