import { Layer } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { ChatContainer } from 'src/modules/Chat';
import { ChatIconWithBadge } from 'src/modules/Chat/components/ChatIconWithBadge';
import { selectChatHistory, selectMyPeer } from 'src/providers/PeerProvider';
import { colors, hardBorderRadius } from 'src/theme';

type Props = {
  containerHeight: number;
};

export const MobileChatWidget: React.FC<Props> = ({ containerHeight }) => {
  const cls = useStyles();
  const chatHistory = useSelector(selectChatHistory);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const newMessageCounter = useRef(0);
  const myPeer = useSelector(selectMyPeer);

  useEffect(() => {
    if (chatHistory && !showChatWindow) {
      if (
        chatHistory.messages.length > 0 &&
        chatHistory.messages[0].fromUserId !== myPeer?.user.id
      ) {
        newMessageCounter.current += 1;
      }
    }
  }, [chatHistory?.messages]);

  useEffect(() => {
    newMessageCounter.current = 0;
  }, []);

  function markMessagesAsRead() {
    newMessageCounter.current = 0;
  }

  return (
    <>
      <ChatIconWithBadge
        color={colors.white}
        onClick={() => {
          markMessagesAsRead();
          setShowChatWindow(true);
        }}
        newMessagesCount={newMessageCounter.current}
      />
      {showChatWindow && (
        <Layer
          modal={true}
          responsive={false}
          position="bottom"
          animation="slide"
          className={cls.chatContainer}
          style={{
            height: containerHeight,
          }}
          onClickOutside={() => setShowChatWindow(false)}
        >
          <ChatContainer />
        </Layer>
      )}
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
  chatContainer: {
    width: 'calc(100% - 16px)',
    padding: '8px',
    ...makeImportant({
      ...hardBorderRadius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      overflow: 'hidden',
    }),
  },
});
