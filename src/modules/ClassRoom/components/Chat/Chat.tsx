import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { ChatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Text, Header } from 'grommet';

type Props = {
  myId: string;
  messages: ChatMessageRecord[];
  onSend: (msg: string) => void;

  className?: string;
};

export const Chat: React.FC<Props> = ({
  onSend,
  myId,
  messages,
  ...props
}) => {
  const cls = useStyles();

  const [input, setInput] = useState('');

  return (
    <div className={cx(cls.container, props.className)}>
      <Header background="light-2" pad="small">
        Chat
      </Header>
      {/* <Text></Text> */}
      <div
        // ref={chatWindowRef}
        id="messageHistory"
        className={cls.messageHistory}
      >
        {messages.map((msg, i) => (
          <div
            key={String(i)}
            className={cx(cls.message, {
              [cls.myMessage]: msg.from.id === myId,
            })}
          >
            <div
              className={cx({
                [cls.messageSenderTitleMe]: msg.from.id === myId,
                [cls.messageSenderTitleOther]: msg.from.id !== myId,
              })}
            >
              {msg.from.name}
            </div>
            <div
              className={cx(cls.messageContent, {
                [cls.myMessageContent]: msg.from.id === myId,
                [cls.otherMessageContent]: msg.from.id !== myId,
              })}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className={cls.inputContainer}>
        <input
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
        <FontAwesomeIcon
          icon={faPaperPlane}
          className={cls.icon}
          onClick={() => {
            if (input.length > 0) {
              onSend(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>

  // </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },

  messageHistory: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: '8px',
    paddingRight: '8px',
    overflowY: 'scroll',
    overflowX: 'hidden',
    marginTop: '10px',
    scrollBehavior: 'smooth',
  },

  message: {},
  myMessage: {},
  messageContent: {
    borderRadius: '10px',
    padding: '5px 15px 5px 15px',
    width: 'auto',
    flexWrap: 'wrap',
    marginBottom: '2px',
    color: 'white',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    fontWeight: 300,
  },
  myMessageContent: {
    backgroundColor: '#86B3C6',
    textAlign: 'right',
    marginLeft: '30px',
  },
  otherMessageContent: {
    marginRight: '30px',
    textAlign: 'left',
    backgroundColor: '#54C4F2',
  },
  messageSenderTitleMe: {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    color: '#333333',
    textAlign: 'right',
    paddingRight: '10px',
    marginBottom: '3px',
  },
  messageSenderTitleOther: {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    color: '#333333',
    textAlign: 'left',
    paddingLeft: '10px',
    marginBottom: '3px',
  },
  inputContainer: {
    padding: '5px',
    position: 'relative',
    display: 'inline-block',
    outline: 'none',
  },
  inputBox: {
    backgroundColor: '#f1f3f4',
    color: '#8e99a4',
    borderRadius: '10px',
    border: '2px solid #f1f3f4',
    font: 'inherit',
    boxSizing: 'border-box',
    width: '85%',
    fontSize: '16px',
    padding: '5px',
    outline: 'none',
    fontFamily: 'Open Sans',
    marginRight: '15px',
    marginLeft: '5px',
  },
  icon: {
    color: '#8e99a4',
    display: 'inline-block',
    fontSize: '20px',
    '&:hover': {
      cursor: 'pointer',
      color: '#6D7073',
    },
  },
});
