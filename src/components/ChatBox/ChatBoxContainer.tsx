import React, { useState } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { ChatMessageRecord } from './records/ChatMessageRecord';
import { ChatBox } from './ChatBox';

type Props = {
  me: {
    id: string;
    name: string;
  };
  broadcastMessage: (
    msg: PeerMessageEnvelope<ChatMessageRecord>['message']
  ) => void;
};

export const ChatBoxContainer: React.FC<Props> = (props) => {
  const [chatHistory, setChatHistory] = useState<ChatMessageRecord[]>([]);

  return (
    <ChatBox
      me={props.me}
      messages={chatHistory}
      onSend={(content) => {
        const msg: ChatMessageRecord = {
          msgType: 'chatMessage',
          from: props.me,
          content,
        };

        props.broadcastMessage(msg);

        setChatHistory((prev) => [...prev, msg]);
      }}
    />
  );
};
