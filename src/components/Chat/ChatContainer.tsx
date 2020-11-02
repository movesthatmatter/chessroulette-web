import React, { useState } from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { eitherToResult } from 'src/lib/ioutil';
import {
  ChatMessageRecord,
  chatMessageRecord,
} from 'dstnd-io';
import { PeerMessageEnvelope } from 'src/components/PeerProvider/records';
import { Chat, ChatProps } from './Chat';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { AwesomeLoader } from 'src/components/AwesomeLoader';

type Props = Omit<ChatProps, 'onSend' | 'messages' | 'myId'>;

export const ChatContainer: React.FC<Props> = (chatProps) => {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);

  const handleMessages = ({ message }: PeerMessageEnvelope) => {
    eitherToResult(chatMessageRecord.decode(message))
      .map((msg) => {
        setMessages((prev) => [...prev, msg]);
      });
  };

  return (
    <PeerConsumer
      onPeerMsgSent={handleMessages}
      onPeerMsgReceived={handleMessages}
      renderFallback={(r) => {
        if (r.state === 'error') {
          return (<AwesomeErrorPage />);
        }

        return <AwesomeLoader />
      }}
      renderRoomJoined={({ room, broadcastMessage }) => (
        <Chat
          myId={room.me.id}
          messages={messages}
          onSend={(content) => {
            const payload: ChatMessageRecord = {
              content,
              from: room.me.user,
              sentAt: toISODateTime(new Date()),
            };

            broadcastMessage(payload);
          }}
          {...chatProps}
        />
      )}
    />
  );
};
