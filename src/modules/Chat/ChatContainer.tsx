import React from 'react';
import { PeerConsumer } from 'src/providers/PeerProvider';
import { ChatMessageRecord } from 'dstnd-io';
import { Chat, ChatProps } from './Chat';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Events } from 'src/services/Analytics';
import {ChatMessageRecordWithReadFeature} from 'typings/chatMessageRecord';
import {v4 as uuid} from 'uuid';

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
            const payload: ChatMessageRecordWithReadFeature = {
              content,
              fromUserId: room.me.user.id,
              sentAt: toISODateTime(new Date()),
              // would be great to actually have an id for each message so we can keep an evidence. at the moment there's no way of retrieving 
              // messages only by date
              id : uuid(),
              read : false,
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
