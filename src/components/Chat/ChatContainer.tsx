import React from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { ChatMessageRecord } from 'dstnd-io';
import { Chat, ChatProps } from './Chat';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Events } from 'src/services/Analytics';

type Props = Omit<ChatProps, 'onSend' | 'messages' | 'myId' | 'history'>;

export const ChatContainer: React.FC<Props> = (chatProps) => {
  return (
    <PeerConsumer
      renderFallback={(r) => {
        if (r.state === 'error') {
          return <AwesomeErrorPage />;
        }

        return <AwesomeLoader />;
      }}
      renderRoomJoined={({ room, request }) => (
        <Chat
          myId={room.me.id}
          history={room.chatHistory}
          onSend={(content) => {
            const payload: ChatMessageRecord = {
              content,
              fromUserId: room.me.user.id,
              sentAt: toISODateTime(new Date()),
            };

            request({
              kind: 'broadcastChatMessage',
              content: payload,
            });

            Events.trackChatMessageSent();
          }}
          {...chatProps}
        />
      )}
    />
  );
};
