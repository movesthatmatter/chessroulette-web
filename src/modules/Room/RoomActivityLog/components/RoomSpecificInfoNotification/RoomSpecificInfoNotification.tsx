import React from 'react';
import { UserRecord } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import { fonts } from 'src/theme';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { RoomSpecificNotifications } from '../../types';
import { hasOwnProperty } from 'src/lib/util';
import { DangerouslySetInnerHTML } from '../../types';
import { Text } from 'src/components/Text';

type Props = {
  notification: RoomSpecificNotifications;
  className?: string;
  me: UserRecord;
};

const isDangerouslySetHtml = (t: unknown): t is DangerouslySetInnerHTML =>
  typeof t === 'object' && hasOwnProperty(t || {}, '__html');

export const RoomSpecificInfoNotification: React.FC<Props> = ({ notification, me, className }) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
        }}
      >
        <div>
          {isDangerouslySetHtml(notification.content) ? (
            <Text size="small1" dangerouslySetInnerHTML={notification.content} />
          ) : (
            <Text size="small1">{notification.content}</Text>
          )}
        </div>
        {notification.actionContent && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            {notification.actionContent}
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    ...fonts.small1,
    marginBottom: spacers.large,
  },
});
