import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { ChatMessageRecord } from 'dstnd-io';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { defaultTheme } from 'src/theme';
import { Chat } from './Chat';
import { minutes, seconds } from 'src/lib/time';
import { toISODateTime } from 'io-ts-isodatetime';


export default {
  component: Chat,
  title: 'modules/Chat',
};

const peerMocker = new PeerMocker();

const peerA = peerMocker.record();
const peerB = peerMocker.record();
// const peerA = peerMocker.record();

const now = (new Date()).getTime();

export const history: ChatMessageRecord[] = [
  {
    content: 'Hey',
    from: peerA.user,
    sentAt: toISODateTime(new Date(now - minutes(3))),
  },
  {
    content: 'Hey there',
    from: peerB.user,
    sentAt: toISODateTime(new Date(now - (minutes(3) + seconds(14)))),
  },
  {
    content: 'Whats good?',
    from: peerA.user,
    sentAt: toISODateTime(new Date(now - (minutes(3) + seconds(44)))),
  },
  {
    content: 'Did you do your homework?',
    from: peerA.user,
    sentAt: toISODateTime(new Date(now - (minutes(2) + seconds(4)))),
  },
  {
    content: 'Oh you know me. I tried to but I couldnt stop playing chess',
    from: peerB.user,
    sentAt: toISODateTime(new Date(now - (minutes(2) + seconds(24)))),
  },
  {
    content: '😀',
    from: peerB.user,
    sentAt: toISODateTime(new Date(now - (minutes(1) + seconds(51)))),
  },
  {
    content: 'Of course hahaha! 😂😂😂',
    from: peerB.user,
    sentAt: toISODateTime(new Date(now - (minutes(1) + seconds(13)))),
  },
];

export const defaultStory = () => React.createElement(() => {
  const [messages, setMessages] = useState<ChatMessageRecord[]>(history);
  const me = peerA;
  
  return (
  <Grommet theme={defaultTheme} >
    <div style={{
      width: '400px',
      height: '500px',
      // background: 'red',
    }}>
      <Chat
        myId={me.id}
        messages={messages}
        onSend={(content) => setMessages((prev) => [
          ...prev,
          {
            content,
            from: me.user,
            sentAt: toISODateTime(new Date()),
          },
        ])}
      />
    </div>
  </Grommet>
)});

export const dualView = () => React.createElement(() => {
  const [messages, setMessages] = useState<ChatMessageRecord[]>(history);
  
  return (
  <Grommet theme={defaultTheme} >
    <div style={{
      display: 'flex',
    }}>
      <div style={{
        width: '400px',
        height: '500px',
        marginRight: '10px',
        // background: 'red',
      }}>
        <Chat
          myId={peerA.id}
          messages={messages}
          onSend={(content) => setMessages((prev) => [
            ...prev,
            {
              content,
              from: peerA.user,
              sentAt: toISODateTime(new Date()),
            },
          ])}
        />
      </div>
      <div style={{
        width: '400px',
        height: '500px',
        // background: 'red',
      }}>
        <Chat
          myId={peerB.id}
          messages={messages}
          onSend={(content) => setMessages((prev) => [
            ...prev,
            {
              content,
              from: peerB.user,
              sentAt: toISODateTime(new Date()),
            },
          ])}
        />
      </div>
    </div>
  </Grommet>
)});

export const dualEmpty = () => React.createElement(() => {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  
  return (
  <Grommet theme={defaultTheme} >
    <div style={{
      display: 'flex',
    }}>
      <div style={{
        width: '400px',
        height: '500px',
        marginRight: '10px',
        // background: 'red',
      }}>
        <Chat
          myId={peerA.id}
          messages={messages}
          onSend={(content) => setMessages((prev) => [
            ...prev,
            {
              content,
              from: peerA.user,
              sentAt: toISODateTime(new Date()),
            },
          ])}
        />
      </div>
      <div style={{
        width: '400px',
        height: '500px',
        // background: 'red',
      }}>
        <Chat
          myId={peerB.id}
          messages={messages}
          onSend={(content) => setMessages((prev) => [
            ...prev,
            {
              content,
              from: peerB.user,
              sentAt: toISODateTime(new Date()),
            },
          ])}
        />
      </div>
    </div>
  </Grommet>
)});