import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { ChatMessageRecord } from 'dstnd-io';
import { arrReverse } from 'src/lib/util';
import { Message } from './components';
import { colors } from 'src/theme';
import { IconButton } from 'src/components/Button';
import { Send } from 'grommet-icons';
import { CSSProperties } from 'src/lib/jss/types';

export type ChatProps = {
  myId: string;
  messages: ChatMessageRecord[];
  onSend: (msg: string) => void;

  className?: string;
  style?: CSSProperties;

  messageHistoryContainerStyle?: CSSProperties;
  inputContainerStyle?: CSSProperties;
};

export const Chat: React.FC<ChatProps> = ({ onSend, myId, messages, ...props }) => {
  const cls = useStyles();

  const [input, setInput] = useState('');
  const [reversedHistory, setReversedHistory] = useState<ChatMessageRecord[]>([]);

  useEffect(() => {
    setReversedHistory(arrReverse(messages));
  }, [messages]);

  return (
    <div className={cx(cls.container, props.className)} style={props.style}>
      <div className={cls.messageHistory}>
        {reversedHistory.map((msg) => (
          <Message key={String(msg.sentAt)} message={msg} myId={myId} />
        ))}
      </div>
      <div style={props.inputContainerStyle}>
        <div className={cls.inputContainer}>
          <div className={cls.inputBoxWrapper}>
            <textarea
              placeholder="Message Here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={cls.inputBox}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim() !== '') {
                  onSend(input);
                  setInput('');
                }
              }}
            />
          </div>
          <IconButton
            disabled={input.length === 0}
            icon={Send}
            type="primary"
            onSubmit={() => {
              if (input.length > 0) {
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
    fontFamily: 'Lato, Open Sans, Roboto Slab, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    padding: 0,
    border: 0,
    outline: 'none',
    resize: 'none',
    width: '100%',
    height: '100%',
  },
});
