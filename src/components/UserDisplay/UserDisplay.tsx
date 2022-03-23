import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { UserRecord } from 'dstnd-io';
import { Text } from '../Text';
import { getUserDisplayName } from 'src/modules/User';
import { Avatar } from '../Avatar';

type Props = {
  user: UserRecord;
  className?: string;
};

export const UserDisplay: React.FC<Props> = ({ user, className }) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, className)}>
      <Avatar mutunachiId={Number(user.avatarId)} />
      
      <Text size="small1" className={cls.displayName}>
        {getUserDisplayName(user)}
      </Text>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  displayName: {
    paddingLeft: spacers.small,
  },
});
