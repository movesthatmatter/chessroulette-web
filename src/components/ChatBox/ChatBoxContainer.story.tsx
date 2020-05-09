/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { JoinFirstAvailableRoomHelper } from 'src/storybook/JoinDefaultRoomHelper';
import { eitherToResult } from 'src/lib/ioutil';
import { PeerMessageEnvelope } from 'src/services/peers';
import { ChatBoxContainer } from './ChatBoxContainer';
import { SocketConsumer, SocketProvider } from '../SocketProvider';
import { PeersProvider } from '../PeersProvider';
import { chatMessageRecord, ChatMessageRecord } from './records/ChatMessageRecord';


export default {
  component: ChatBoxContainer,
  title: 'Components/ChatBox/ChatBoxContainer',
};

export const defaultStory = () => React.createElement(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessageRecord[]>([]);

  const handleMessages = (envelope: PeerMessageEnvelope) => {
    eitherToResult(chatMessageRecord.decode(envelope.message)).map((msg) => {
      if (msg.msgType === 'chatMessage') {
        setChatHistory((prev) => [...prev, msg]);
      }
    });
  };

  return (
    <SocketProvider>
      <JoinFirstAvailableRoomHelper
        render={({ room, me }) => (
          <SocketConsumer
            render={({ socket }) => (
              <PeersProvider
                me={me}
                peers={Object.values(room.peers)}
                socket={socket}
                onPeerMsgReceived={handleMessages}
                onPeerMsgSent={handleMessages}
                onReady={(client) => client.connect()}
                render={({ broadcastMessage, peerConnections }) => (
                  <div>
                    <div>
                      {`Me: ${me.name}`}
                    </div>
                    <div>
                      {'Peers: '}
                      {Object.values(peerConnections).map((pc) => (
                        <span key={pc.peerId}>
                          {room.peers[pc.peerId].name}
                          {' '}
                          |
                          {' '}
                        </span>
                      ))}
                    </div>
                    <ChatBoxContainer
                      me={me}
                      broadcastMessage={broadcastMessage}
                      chatHistory={chatHistory}
                    />
                  </div>
                )}
              />
            )}
          />
        )}
      />
    </SocketProvider>
  );
});
