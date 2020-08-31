/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { JoinFirstAvailableRoomHelper } from 'src/storybook/JoinDefaultRoomHelper';
import { eitherToResult } from 'src/lib/ioutil';
import { PeerMessageEnvelope } from 'src/services/peers';
import { ChatBoxContainer } from './ChatBoxContainer';
import { SocketProvider } from '../SocketProvider';
import { chatMessageRecord, ChatMessageRecord } from './records/ChatMessageRecord';
import { RoomProvider } from '../RoomProvider';

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
        render={({ room: socketRoom, me }) => (
          <RoomProvider
            id={socketRoom.id}
            code={'code' in socketRoom ? socketRoom.code : undefined}
            onMessageReceived={handleMessages}
            onMessageSent={handleMessages}
            renderFallback={() => (
              <>
                {`Couldn't connect to Room ${socketRoom.name}`}
              </>
            )}
            render={({ room, broadcastMessage }) => (
              <>
                <div>
                  {`Me: ${me.user.name}`}
                </div>
                <div>
                  {'Peers: '}
                  {Object.values(room.peers).map((peer) => (
                    <span key={peer.id}>
                      {peer.user.name}
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
              </>
            )}
          />
        )}
      />
    </SocketProvider>
  );
});
