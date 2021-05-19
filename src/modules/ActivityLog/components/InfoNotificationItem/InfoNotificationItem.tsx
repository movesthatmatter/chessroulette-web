import React from 'react';
import { UserRecord } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import { fonts } from 'src/theme';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { InfoNotification } from '../../types';

type Props = {
  notification: InfoNotification;
  className?: string;
  me: UserRecord;
};

export const InfoNotificationItem: React.FC<Props> = ({ notification, me, className }) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'right',
        }}
      >
        {notification.content}
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
