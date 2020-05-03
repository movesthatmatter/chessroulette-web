/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { now } from 'src/lib/date';
import { ChatBox } from './ChatBox';


export default {
  component: ChatBox,
  title: 'Components/ChatBox',
};

const me = 'Gabe';
const peers = {
  Kasparov: 'Kasparov',
  'Michael Tal': 'Michael Tal',
};


export const defaultStory = () => React.createElement(() => {
  const [messages, setMessages] = useState([
    {
      content: 'Hello folks',
      fromPeerId: me,
      toPeerId: me,
      timestamp: String(now().getTime()),
    },
    {
      content: 'Hello there',
      fromPeerId: peers.Kasparov,
      toPeerId: me,
      timestamp: String(now().getTime() + 1234),
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
            content,
            fromPeerId: me,
            toPeerId: '*',
            timestamp: String(now().getTime()),
          },
        ]);
      }}
    />
  );
});
