import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerMessage } from 'src/services/peer2peer/records/PeerMessagingPayload';
import { noop } from 'src/lib/util';
import cx from 'classnames';


type Props = {
  me: string;
  messages: PeerMessage[];
  onSend?: (text: string) => void;
};

export const ChatBox: React.FC<Props> = ({
  me,
  messages,
  onSend = noop,
}) => {
  const cls = useStyles();
  const [input, setInput] = useState('');

  return (
    <div className={cls.container}>
      <div className={cls.messageHistory}>
        {messages.map((msg, i) => (
          <div
            key={`${msg.timestamp + i}`}
            className={cx(cls.message, {
              [cls.myMessage]: msg.fromPeerId === me,
            })}
          >
            <div>{msg.fromPeerId}</div>
            <div className={cx(cls.messageContent, {
              [cls.myMessageContent]: msg.fromPeerId === me,
            })}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className={cls.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cls.inputBox}
          rows={3}
        />
        <button
          type="button"
          onClick={() => {
            onSend(input);
            setInput('');
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    // backgroundColor: 'gray',
    flexDirection: 'column',
    maxWidth: '500px',
  },
  messageHistory: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    flex: 1,
    paddingLeft: '10px',
    paddingRight: '10px',
    overflow: 'scroll',
  },
  inputContainer: {

  },
  inputBox: {
    width: '100%',
    border: '1px solid #eee',
  },
  message: {

  },
  myMessage: {
    textAlign: 'right',
  },
  messageContent: {
    backgroundColor: '#e9685a',
    padding: '12px',
    // maxWidth: '80%',
    width: 'auto',
    flexWrap: 'wrap',
    // display: 'inline',
    marginBottom: '30px',
    borderRadius: '16px',
    color: 'white',
  },
  myMessageContent: {
    backgroundColor: 'grey',
    // alignSelf: '',
    // marginLeft: '20%',
    textAlign: 'right',
  },

});
