/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { now } from 'src/lib/date';
import { PeerMessageEnvelope } from 'src/services/peers';
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
  Kasparov: 'Kasparov',
  'Michael Tal': 'Michael Tal',
};

export const defaultStory = () => React.createElement(() => {
  const [messages, setMessages] = useState<PeerMessageEnvelope<ChatMessageRecord>[]>([
    {
      fromPeerId: me.id,
      toPeerId: me.id,
      timestamp: String(now().getTime()),
      message: {
        msgType: 'chatMessage',
        content: 'Hello folks',
      } as const,
    },
    {
      fromPeerId: peers.Kasparov,
      toPeerId: me.id,
      timestamp: String(now().getTime() + 1234),
      message: {
        msgType: 'chatMessage',
        content: 'Hello there',
      } as const,
    },
  ]);

  return (
    <ChatBox
      me={me}
      messages={messages}
      onSend={(content) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            fromPeerId: me,
            toPeerId: '*',
            timestamp: String(now().getTime()),
            message: {
              msgType: 'chatMessage',
              content,
            },
          },
        ]);
      }}
    />
  );
});
