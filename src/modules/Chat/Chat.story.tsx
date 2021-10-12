/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { ChatHistoryRecord, ChatMessageRecord, UserInfoRecord } from 'dstnd-io';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
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

const now = new Date().getTime();

const initHistory: ChatHistoryRecord = {
  id: '0',
  usersInfo: {
    [peerA.id]: peerA.user,
    [peerB.id]: peerB.user,
  },
  messages: [
    {
      content: 'Hey',
      fromUserId: peerA.user.id,
      sentAt: toISODateTime(new Date(now - minutes(3))),
    },
    {
      content: 'Hey there',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(3) + seconds(14)))),
    },
    {
      content: 'Whats good?',
      fromUserId: peerA.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(3) + seconds(44)))),
    },
    {
      content: 'Did you do your homework?',
      fromUserId: peerA.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(2) + seconds(4)))),
    },
    {
      content: 'Oh you know me. I tried to but I couldnt stop playing chess',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(2) + seconds(24)))),
    },
    {
      content: '😀',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(1) + seconds(51)))),
    },
    {
      content: 'Of course hahaha! 😂😂😂',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(1) + seconds(13)))),
    },
  ],
};

const prependMessage = (history: ChatHistoryRecord, user: UserInfoRecord, msg: ChatMessageRecord['content']) => {
  return {
    ...history,
    messages: [
      {
        content: msg,
        fromUserId: user.id,
        sentAt: toISODateTime(new Date()),
      },
      ...history.messages,
    ],
    usersInfo: {
      ...history.usersInfo,
      [user.id]: user,
    }
  }
}

export const defaultStory = () =>
  React.createElement(() => {
    const [history, setHistory] = useState<ChatHistoryRecord>(initHistory);
    const me = peerA;

    return (
        <div
          style={{
            width: '400px',
            height: '500px',
            // background: 'red',
          }}
        >
          <Chat
            myId={me.id}
            history={history}
            onSend={(content) => setHistory((prev) => prependMessage(prev, me.user, content))}
          />
        </div>
    );
  });

export const dualView = () =>
  React.createElement(() => {
    const [history, setHistory] = useState<ChatHistoryRecord>(initHistory);

    return (
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '400px',
              height: '500px',
              marginRight: '10px',
              // background: 'red',
            }}
          >
            <Chat
              myId={peerA.id}
              history={history}
              onSend={(content) => setHistory((prev) => prependMessage(prev, peerA.user, content))}
            />
          </div>
          <div
            style={{
              width: '400px',
              height: '500px',
              // background: 'red',
            }}
          >
            <Chat
              myId={peerB.id}
              history={history}
              onSend={(content) => setHistory((prev) => prependMessage(prev, peerB.user, content))}
            />
          </div>
        </div>
    );
  });

export const dualEmpty = () =>
  React.createElement(() => {
    const [history, setHistory] = useState<ChatHistoryRecord>({
      id: '0',
      usersInfo: {},
      messages: [],
    });

    return (
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '400px',
              height: '500px',
              marginRight: '10px',
              // background: 'red',
            }}
          >
            <Chat
              myId={peerA.id}
              history={history}
              onSend={(content) => setHistory((prev) => prependMessage(prev, peerA.user, content))}
            />
          </div>
          <div
            style={{
              width: '400px',
              height: '500px',
              // background: 'red',
            }}
          >
            <Chat
              myId={peerB.id}
              history={history}
              onSend={(content) => setHistory((prev) => prependMessage(prev, peerB.user, content))}
            />
          </div>
        </div>
    );
  });
