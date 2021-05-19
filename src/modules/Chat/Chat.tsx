import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { ChatHistoryRecord } from 'dstnd-io';
import { Message } from './components';
import { colors, onlySmallMobile } from 'src/theme';
import { IconButton } from 'src/components/Button';
import { Send } from 'grommet-icons';
import { CSSProperties } from 'src/lib/jss/types';

export type ChatProps = {
  myId: string;
  history: ChatHistoryRecord;
  onSend: (msg: string) => void;

  className?: string;
  style?: CSSProperties;

  messageHistoryContainerStyle?: CSSProperties;
  inputContainerStyle?: CSSProperties;
};

export const Chat: React.FC<ChatProps> = ({ onSend, myId, history, ...props }) => {
  const cls = useStyles();
  const [input, setInput] = useState('');

  return (
    <div className={cx(cls.container, props.className)} style={props.style}>
      <div className={cls.messageHistory}>
        {history.messages.map((msg, index) => {
          return (
            <Message
              sameUser={history.messages[index - 1]?.fromUserId === msg.fromUserId}
              key={`${msg.fromUserId}-${msg.sentAt}`}
              message={msg}
              myId={myId}
              user={history.usersInfo[msg.fromUserId]}
            />
          );
        })}
      </div>
      <div style={props.inputContainerStyle} className={cls.bottomPart}>
        <div className={cls.inputContainer}>
          <div className={cls.inputBoxWrapper}>
            <textarea
              placeholder="Type your message here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={cls.inputBox}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim() !== '') {
                  onSend(input);
                  setInput('');

                  // Don't add a new line
                  e.preventDefault();
                }
              }}
            />
          </div>
          <IconButton
            disabled={input.length === 0}
            icon={Send}
            type="primary"
            onSubmit={() => {
              if (input.trim() !== '') {
                onSend(input);
                setInput('');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messageHistory: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    paddingLeft: '8px',
    paddingRight: '8px',
    overflowY: 'scroll',
    marginTop: '10px',
    scrollBehavior: 'smooth',
  },
  bottomPart: {
    ...onlySmallMobile({ height: '50px' }),
  },
  inputContainer: {
    borderTop: 'solid 1px',
    borderColor: colors.neutral,
    paddingTop: '16px',
    display: 'flex',
    flex: 1,
    height: 'calc(100% - 16px)',
  },
  inputBoxWrapper: {
    flex: 1,
    paddingRight: '16px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  inputBox: {
    flex: 1,
    fontSize: '13px',
    fontFamily: 'Lato, Open Sans, sans-serif',
    fontWeight: 400,
    padding: 0,
    border: 0,
    outline: 'none',
    resize: 'none',
    width: '100%',
    height: '100%',
  },
});
