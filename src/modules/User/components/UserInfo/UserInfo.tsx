import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { colors, fonts } from 'src/theme';
import { Text } from 'src/components/Text';
import { getUserDisplayName } from 'src/modules/User';
import { spacers } from 'src/theme/spacers';
import { Avatar } from 'src/components/Avatar';
import { UserInfoRecord } from 'dstnd-io';

type Props = {
  darkMode?: boolean;
  reversed?: boolean;
  user: UserInfoRecord;
};

export const UserInfo: React.FC<Props> = ({ darkMode, reversed, user }) => {
  const cls = useStyles();

  return (
    <div
      className={cx(
        cls.container,
        darkMode && cls.containerDarkMode,
        reversed && cls.containerReversed
      )}
    >
      <Avatar mutunachiId={Number(user.avatarId)} />
      <div className={cls.spacer} />
      <div className={cx(cls.textWrapper, cls.textWrapperCentered)}>
        <Text className={cls.userNameText}>{getUserDisplayName(user)}</Text>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
  },
  containerReversed: {
    flexDirection: 'row-reverse',
  },
  containerDarkMode: {
    color: colors.white,
  },
  userNameText: {
    ...fonts.small2,
  },
  spacer: {
    paddingLeft: spacers.small,
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  textWrapperCentered: {
    justifyContent: 'center',
  },
});