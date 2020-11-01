import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { ChatMessageRecord, UserRecord } from 'dstnd-io';
import { colors, fonts } from 'src/theme';
import { Text } from 'grommet';

type Props = {
  myId: UserRecord['id'];
  message: ChatMessageRecord;
};

export const Message: React.FC<Props> = ({
  myId,
  message,
}) => {
  const cls = useStyles();

  return (
    <div
      className={cx(cls.message, {
        [cls.myMessage]: message.from.id === myId,
      })}
    >
      <div className={cx(cls.messageContentWrapper, {
        [cls.myMessageContentWrapper]: message.from.id === myId,
        [cls.otherMessageContentWrapper]: message.from.id !== myId,
      })}>
        <Text
          className={cx(cls.messageContent, {
            [cls.myMessageContent]: message.from.id === myId,
            [cls.otherMessageContent]: message.from.id !== myId,
          })}
        >
          {message.content}
        </Text>
      </div>
      {message.from.id !== myId && (
        <Text className={cls.messageSender}>
          {message.from.name}
        </Text>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  message: {
    // background: 'red',
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'column',
  },
  myMessage: {},
  messageContentWrapper: {
    maxWidth: '70%',
  },
  myMessageContentWrapper: {
    marginLeft: 'auto',
    display: 'flex',
  },
  otherMessageContentWrapper: {},
  messageContent: {
    borderRadius: '12px',
    padding: '10px 14px',
    flexWrap: 'wrap',
    ...fonts.small2,
    display: 'inline-block',
  },
  myMessageContent: {
    backgroundColor: colors.neutral,
    borderBottomRightRadius: 0,
    marginLeft: 'auto',
  },
  otherMessageContent: {
    marginRight: '30px',
    textAlign: 'left',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: colors.neutral,
    borderBottomLeftRadius: 0,
  },
  messageSender: {
    ...fonts.small3,
    fontWeight: 300,
    paddingTop: '8px',
  },
});