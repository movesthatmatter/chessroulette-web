import React, { useState } from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { eitherToResult } from 'src/lib/ioutil';
import {
  ChatMessageRecord,
  chatMessageRecord,
} from 'src/components/ChatBox/records/ChatMessageRecord';
import { PeerMessageEnvelope } from 'src/components/PeerProvider/records';
import { Chat, ChatProps } from './Chat';

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
      render={({ room, broadcastMessage }) => (
        <Chat
          myId={room.me.id}
          messages={messages}
          onSend={(content) => {
            const payload: ChatMessageRecord = {
              msgType: 'chatMessage',
              content,
              from: room.me,
            };

            broadcastMessage(payload);
          }}
          {...chatProps}
        />
      )}
    />
  );
};
