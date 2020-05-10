import React, { useState, useRef, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import chatSVG from './assets/chat_circle.svg';
import { ChatMessageRecord } from './records/ChatMessageRecord';


type Props = {
  me: {
    id: string;
    name: string;
  };
  messages: ChatMessageRecord[];
  onSend?: (text: string) => void;
};

export const ChatBox: React.FC<Props> = ({ me, messages, onSend = noop }) => {
  const cls = useStyles();
  const [input, setInput] = useState('');
  const [chatWindowMouseOver, setChatWindowMouseOver] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessageCounter, setNewMessageCounter] = useState(0);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const chatExpanded = (
    <div className={cx(cls.container, {
      [cls.containerOpen]: chatOpen,
    })}
    >
      <div ref={chatWindowRef} id="messageHistory" className={cls.messageHistory}>
        {messages.map((msg, i) => (
          <div
            key={String(i)}
            className={cx(cls.message, {
              [cls.myMessage]: msg.from.id === me.id,
            })}
          >
            <div className={cx({
              [cls.messageSenderTitleMe]: msg.from.id === me.id,
              [cls.messageSenderTitleOther]: msg.from.id !== me.id,
            })}
            >
              {msg.from.name}
            </div>
            <div className={cx(cls.messageContent, {
              [cls.myMessageContent]: msg.from.id === me.id,
              [cls.otherMessageContent]: msg.from.id !== me.id,
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
            inputKeyPressHandler(e);
          }}
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          className={cls.icon}
          onClick={() => {
            if (input.trim() !== '') {
              onSend(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>
  );
  useEffect(() => {
    if (!chatOpen && messages[messages.length - 1].from.id !== me.id) {
      setNewMessageCounter((prevState) => {
        const incCounter = prevState + 1;
        return incCounter;
      });
    }
  }, [messages]);
  useEffect(() => scrollToBottom(), [messages]);
  const scrollToBottom = () => {
    if (chatWindowRef && chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };
  const inputKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && input.trim() !== '') {
      onSend(input);
      setInput('');
    }
  };
  const chatExpandHandler = (): void => {
    setChatOpen((prevToggle) => !prevToggle);
    setNewMessageCounter(0);
  };

  return (
    <div className={cls.chatContainer}>
      <div style={{ position: 'relative' }}>
        <div
          className={cx(cls.chatWindowCondensed, {
            [cls.chatWindowCondensedHover]: chatWindowMouseOver,
            [cls.chatWindowUpperBarOpen]: chatOpen,
          })}
          onClick={() => chatExpandHandler()}
          onMouseOver={() => setChatWindowMouseOver(true)}
          onMouseOut={() => setChatWindowMouseOver(false)}
          onFocus={() => setChatWindowMouseOver(true)}
          onBlur={() => setChatWindowMouseOver(false)}
        >
          <div className={cls.chatWindowHeaderText}>Chat</div>
          <div className={cls.chatNotificationIcon}>
            <img src={chatSVG} alt="chat icon" />
            <div className={cls.counterContainer}>{newMessageCounter > 0 ? newMessageCounter : ''}</div>
          </div>
        </div>
      </div>
      {chatOpen ? chatExpanded : null}
    </div>
  );
};

const useStyles = createUseStyles({
  chatContainer: {
    position: 'absolute',
    maxWidth: '320px',
    bottom: '0',
    marginBottom: '20px',
    zIndex: 1,
  },
  chatWindowCondensed: {
    width: '320px',
    backgroundColor: '#FF7262',
    borderRadius: '14px 14px 14px 14px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
    marginTop: '50px',
    // transition: 'all .5s ease-in-out',
    zIndex: 2,
  },
  chatWindowUpperBarOpen: {
    borderRadius: '14px 14px 0px 0px',
  },
  chatWindowCondensedHover: {
    backgroundColor: '#E66162',
    cursor: 'pointer',
  },
  chatWindowHeaderText: {
    fontFamily: 'Roboto',
    fontSize: '24px',
    fontWeight: 'normal',
    color: 'white',
    lineHeight: '28px',
    padding: '10px',
    marginLeft: '10px',
  },
  chatNotificationIcon: {
    position: 'absolute',
    bottom: '20%',
    left: '80%',
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxWidth: '320px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',
    borderRadius: '0px 0px 14px 14px',
    backgroundColor: 'white',
  },
  containerOpen: {
    height: '450px',
    backgroundColor: 'white',
  },
  messageHistory: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: '10px',
    paddingRight: '10px',
    overflowY: 'scroll',
    overflowX: 'hidden',
    marginTop: '15px',
    scrollBehavior: 'smooth',
  },
  inputContainer: {
    padding: '10px',
    position: 'relative',
    display: 'inline-block',
    outline: 'none',
  },
  inputBox: {
    backgroundColor: '#f1f3f4',
    color: '#8e99a4',
    borderRadius: '14px',
    border: '2px solid #f1f3f4',
    font: 'inherit',
    boxSizing: 'border-box',
    width: '85%',
    fontSize: '18px',
    padding: '5px',
    outline: 'none',
    fontFamily: 'Roboto',
    marginRight: '15px',
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
  counterContainer: {
    color: 'white',
    fontSize: '24px',
    fontFamily: 'Roboto Slab',
    position: 'absolute',
    top: '20%',
    left: '40%',
  },
  message: {},
  myMessage: {

  },
  messageContent: {
    borderRadius: '18px',
    padding: '5px 15px 5px 15px',
    width: 'auto',
    flexWrap: 'wrap',
    marginBottom: '2px',
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: '18px',
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
    fontFamily: 'Roboto',
    color: '#333333',
    textAlign: 'right',
    paddingRight: '10px',
    marginBottom: '3px',
  },
  messageSenderTitleOther: {
    fontFamily: 'Roboto',
    color: '#333333',
    textAlign: 'left',
    paddingLeft: '10px',
    marginBottom: '3px',
  },
});
