import { UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'src/components/Modal/Modal';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { ChatContainer } from 'src/modules/Chat';
import { ChatIconWithBadge } from 'src/modules/Chat/components/ChatIconWithBadge';
import { selectChatHistory } from 'src/providers/PeerProvider';
import { CustomTheme, hardBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';

type Props = {
  containerHeight: number;
  myUserId: UserRecord['id'];
};

export const MobileChatWidget: React.FC<Props> = ({ myUserId, containerHeight }) => {
  const cls = useStyles();
  const chatHistory = useSelector(selectChatHistory);
  const [newMessageCounter, setNewMessageCounter] = useState(0);
  const [show, setShow] = useState(false);
  const [closedAt, setClosedAt] = useState(new Date());
  const { theme } = useColorTheme();

  useEffect(() => {
    if (chatHistory && !show) {
      const unreadMessages = chatHistory.messages.filter(
        (m) => myUserId !== m.fromUserId && new Date(m.sentAt).getTime() > closedAt.getTime()
      );

      setNewMessageCounter(unreadMessages.length);
    }
  }, [chatHistory?.messages, closedAt]);

  useEffect(() => {
    if (show === false) {
      setClosedAt(new Date());
    }
  }, [show]);

  const markMessagesAsRead = () => {
    setNewMessageCounter(0);
  };

  return (
    <>
      <ChatIconWithBadge
        color="white"
        onClick={() => {
          markMessagesAsRead();

          setShow(true);
        }}
        newMessagesCount={newMessageCounter}
      />
      {show && (
        <Modal
          className={cls.chatContainer}
          style={{
            height: `${containerHeight}px`,
          }}
          onClose={() => {
            setShow(false);
          }}
        >
          <ChatContainer />
        </Modal>
      )}
    </>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {},
  chatContainer: {
    //width: `calc(100% - ${spacers.default})`,
    width: '100%',
    position: 'absolute',
    bottom: '0',
    background: theme.colors.white,
    padding: spacers.small,
    ...makeImportant({
      ...hardBorderRadius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      overflow: 'hidden',
    }),
  },
}));
