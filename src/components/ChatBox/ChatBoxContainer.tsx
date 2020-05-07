import React, { useState } from 'react';
import { PeerRecord } from 'dstnd-io';
import { isRight } from 'fp-ts/lib/Either';
import { ChatBox } from './ChatBox';
import {
  ChatMessageRecord,
  chatMessageRecord,
} from './records/ChatMessageRecord';
import { PeersProvider } from '../PeersProvider';
import { SocketConsumer } from '../SocketProvider';

type Props = {
  me: PeerRecord;
  peers: PeerRecord[];
};
export const ChatBoxContainer: React.FC<Props> = (props) => {
  const [chatHistory, setChatHistory] = useState<ChatMessageRecord[]>([]);

  const pushToChatHistory = (next: ChatMessageRecord) => {
    setChatHistory((prev) => [...prev, next]);
  };

  return (
    <SocketConsumer
      render={({ socket }) => (
        <PeersProvider
          me={props.me}
          peers={props.peers}
          socket={socket}
          onReady={({ startAVBroadcasting }) => {
            startAVBroadcasting();
          }}
          onPeerMsgSent={({ message }) => {
            console.log('Sendig own message', message);

            const decoded = chatMessageRecord.decode(message);

            if (isRight(decoded)) {
              const msg = decoded.right;

              if (msg.msgType === 'chatMessage') {
                pushToChatHistory(msg);
              }
            }
          }}
          onPeerMsgReceived={({ message }) => {
            const decoded = chatMessageRecord.decode(message);

            if (isRight(decoded)) {
              const msg = decoded.right;

              if (msg.msgType === 'chatMessage') {
                pushToChatHistory(msg);
              }
            }
          }}
          render={({ startAVBroadcasting, broadcastMessage }) => (
            <ChatBox
              me={props.me}
              messages={chatHistory}
              onSend={(content) => {
                // Do I need to serialize it??
                const payload: ChatMessageRecord = {
                  msgType: 'chatMessage',
                  from: props.me,
                  content,
                };

                broadcastMessage(payload);
              }}
            />
          )}
        />
      )}
    />
  );
};
