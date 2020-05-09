/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { ChatBox } from './ChatBox';
import { ChatMessageRecord } from './records/ChatMessageRecord';

export default {
  component: ChatBox,
  title: 'Components/ChatBox',
};

const me = {
  id: 'gabe',
  name: 'Gabe',
};
const peers = {
  kasparov: {
    id: 'kasparov',
    name: 'Kasparov',
  },
  tal: {
    id: 'Michael Tal',
    name: 'Michael Tal',
  },
};

export const defaultStory = () => React.createElement(() => {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([
    {
      msgType: 'chatMessage',
      content: 'Hello folks',
      from: me,
    } as const,
    {
      msgType: 'chatMessage',
      content: 'Hello there',
      from: peers.kasparov,
    } as const,
  ]);

  return (
    <ChatBox
      me={me}
      messages={messages}
      onSend={(content) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            msgType: 'chatMessage',
            content,
            from: me,
          },
        ]);
      }}
    />
  );
});
