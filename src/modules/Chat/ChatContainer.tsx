import React from 'react';
import { ChatMessageRecord } from 'dstnd-io';
import { Chat, ChatProps } from './Chat';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { AwesomeError } from 'src/components/AwesomeError';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Events } from 'src/services/Analytics';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';
import { Room } from 'src/providers/PeerProvider';

type Props = Omit<ChatProps, 'onSend' | 'messages' | 'myId' | 'history'> & {
  room: Room;
};

export const ChatContainer: React.FC<Props> = ({ room, ...chatProps }) => {
  // const peerState = usePeerState();
  const pc = usePeerConnection();

  if (pc.loading) {
    return <AwesomeLoader />;
  }

  if (!pc.ready) {
    return <AwesomeError />;
  }

  return (
    // TODO: Maybe it's better for this to be taken from redux!
    //  As the Room already contains it!
    <Chat
      myId={room.me.id}
      history={room.chatHistory}
      onSend={(content) => {
        const payload: ChatMessageRecord = {
          content,
          fromUserId: room.me.user.id,
          sentAt: toISODateTime(new Date()),
        };
        pc.connection.send({
          kind: 'broadcastChatMessage',
          content: payload,
        });

        Events.trackChatMessageSent();
      }}
      {...chatProps}
    />
  );
};
