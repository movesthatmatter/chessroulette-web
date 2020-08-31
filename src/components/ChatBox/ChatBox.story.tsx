/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { ChatBox } from './ChatBox';
import { ChatMessageRecord } from './records/ChatMessageRecord';

export default {
  component: ChatBox,
  title: 'Components/ChatBox',
};

const peerMocker = new PeerMocker();

const me = peerMocker.withUserInfoProps({ name: 'gabe' });

const peers = {
  kasparov: peerMocker.withUserInfoProps({ name: 'kasparov' }),
  tal: peerMocker.withUserInfoProps({ name: 'tal' }),
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
