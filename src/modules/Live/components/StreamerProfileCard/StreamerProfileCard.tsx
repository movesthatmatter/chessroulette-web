import React, { useMemo } from 'react';
import cx from 'classnames';
import { AnchorLink } from 'src/components/AnchorLink';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { Streamer } from '../../types';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { onlyDesktop, onlyMobile } from 'src/theme';

type Props = {
  streamer: Streamer;
  size?: 'small' | 'medium' | 'large';
  compact?: boolean;
  descriptionLength?: number;
  containerClassName?: string;
  style?: CSSProperties;
};

export const StreamerProfileCard: React.FC<Props> = ({
  streamer,
  descriptionLength = 75,
  size = 'small',
  style,
  containerClassName,
  compact = false,
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();
  const device = useDeviceSize();

  const avatarSize = useMemo(() => (device.isDesktop ? 54 : 36), [device]);

  const description = useMemo(() => {
    return streamer.description.length > descriptionLength
      ? `${streamer.description?.slice(0, descriptionLength)}...`
      : streamer.description;
  }, [streamer.description, descriptionLength]);

  if (compact) {
    return (
      <div className={cx(cls.compactContainer, containerClassName)}>
        <AnchorLink href={`https://twitch.tv/${streamer.username}`} target="_blank">
          <div className={cls.compactMain}>
            <Avatar imageUrl={streamer.profileImageUrl} size={avatarSize} />
            <Text size="small1" className={cls.displayName}>
              {streamer.displayName}
            </Text>
          </div>
        </AnchorLink>
      </div>
    );
  }

  return (
    <div className={cx(cls.container, containerClassName)} style={style}>
      <AnchorLink
        href={`https://twitch.tv/${streamer.username}`}
        baseColor={theme.colors.black}
        visitedColor={theme.colors.black}
        hoverColor={theme.colors.black}
      >
        <Avatar imageUrl={streamer.profileImageUrl} size={avatarSize} />
      </AnchorLink>
      <div className={cls.expandedInfo}>
        <AnchorLink href={`https://twitch.tv/${streamer.username}`} target="_blank">
          <Text asLink size="subtitle1">
            {streamer.displayName}
          </Text>
        </AnchorLink>
        {compact || (
          <>
            <br />
            <Text size="body2">
              <Text size="small1">{description}</Text>
              <br />
              <AnchorLink href={`https://twitch.tv/${streamer.username}/about`} target="_blank">
                Learn More
              </AnchorLink>
            </Text>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    overflow: 'hidden',

    ...onlyMobile({
      flexDirection: 'column',
    }),
  },
  expandedInfo: {
    ...onlyDesktop({
      paddingLeft: spacers.default,
    }),
  },
  compactContainer: {
    display: 'inline-block',
  },
  compactMain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  displayName: {
    paddingTop: spacers.small,
    ...makeImportant({
      color: theme.colors.black,
    }),
  },
}));
