import React, { useMemo } from 'react';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { getUserDisplayName } from 'src/modules/User/util';
import { UserState } from '../../types';
import { AuthenticationButton } from 'src/services/Authentication/widgets';
import { effects } from 'src/theme';
import { FloatingBox } from 'src/components/FloatingBox';

type Props = {
  className?: string;
  callToActionComponent?: (user: UserState) => React.ReactNode;
} & UserState;

export const UserProfileShowcase: React.FC<Props> = ({
  className,
  callToActionComponent,
  ...props
}) => {
  const cls = useStyles();
  const username = useMemo(() => getUserDisplayName(props.user), [props.user]);

  return (
    <FloatingBox className={cx(cls.container, className)}>
      <div className={cls.userInfoContainer}>
        <div className={cls.avatarContainer}>
          <Avatar mutunachiId={Number(props.user.avatarId)} size={64} />
        </div>
        <Text size="subtitle1">{props.isGuest ? `Guest` : username}</Text>

        <div className={cls.statsContainer}>
          <div className={cls.statContainer}>
            <Text size="small1">Games</Text>
            <Text size="subtitle2">{props.isGuest ? 0 : props.stats.gamesCount}</Text>
          </div>
          <div className={cls.statContainer}>
            <Text size="small1">Wins</Text>
            <Text size="subtitle2">{props.isGuest ? 0 : props.stats.wins}</Text>
          </div>
          <div className={cls.statContainer}>
            <Text size="small1">Loses</Text>
            <Text size="subtitle2">{props.isGuest ? 0 : props.stats.loses}</Text>
          </div>
          <div className={cls.statContainer}>
            <Text size="small1">Draws</Text>
            <Text size="subtitle2">{props.isGuest ? 0 : props.stats.draws}</Text>
          </div>
        </div>
      </div>

      {props.isGuest && (
        <div className={cls.authContainer}>
          <AuthenticationButton label="Login" full />
          <br />
        </div>
      )}
      {callToActionComponent && (
        <div className={cls.ctaContainer}>{callToActionComponent(props)}</div>
      )}
    </FloatingBox>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    // background: theme.name === 'lightDefault' ? theme.colors.neutral : theme.colors.neutralDark,
    background: theme.depthBackground.backgroundColor,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    padding: spacers.large,
    // border: `1px solid rgba(0, 0, 0, .5)`,
    // ...effects.softFloatingShadowDarkMode,
    // ...effects.hardBorderRadius,

    // ...theme.name === 'darkDefault' && {
    //   ...effects.softFloatingShadowDarkMode,
    // },
  },
  avatarContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacers.small,
    // background: 'red',
  },
  userInfoContainer: {
    paddingTop: spacers.small,
    textAlign: 'center',
  },
  statsContainer: {
    display: 'flex',
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacers.default,
  },
  statContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: spacers.small,
    marginRight: spacers.small,
  },
  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: spacers.default,
  },

  ctaContainer: {},
}));
