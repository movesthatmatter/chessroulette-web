import React from 'react';
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
  chatHistory: ChatMessageRecord[];
};


// This doesn't do much for now but it will most likely
//  receive a Peers wrapper to be able to maintain it's own state and push updates
export const ChatBoxContainer: React.FC<Props> = (props) => (
  <ChatBox
    me={props.me}
    messages={props.chatHistory}
    onSend={(content) => {
      const msg: ChatMessageRecord = {
        msgType: 'chatMessage',
        from: props.me,
        content,
      };

      props.broadcastMessage(msg);
    }}
  />
);
