import { ResourceRecords } from 'dstnd-io';
import React, { useMemo } from 'react';
import { AspectRatio, AspectRatioExplicit } from 'src/components/AspectRatio';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { hardBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Math } from 'window-or-global';
import cx from 'classnames';
import { Show } from 'react-iconly';

type Props = {
  streamer: ResourceRecords.Watch.LiveStreamerRecord;
  containerClassName?: string;
};

const parseUrl = (url: string, { width, height }: { width: number; height: number }) => {
  return url.replaceAll('{width}', `${width}`).replaceAll('{height}', `${height}`);
};

const getAspectRatioFromWidth = (aspectRatio: AspectRatioExplicit | number, width: number) => {
  const ratio =
    typeof aspectRatio === 'number' ? aspectRatio : aspectRatio.width / aspectRatio.height;

  return {
    width,
    height: Math.ceil(width / ratio),
  } as const;
};

const TWITCH_SIZES = {
  w720: getAspectRatioFromWidth({ width: 16, height: 9 }, 720),
  w440: getAspectRatioFromWidth({ width: 16, height: 9 }, 440),
  w320: getAspectRatioFromWidth({ width: 16, height: 9 }, 320),
};

export const LiveStreamCard: React.FC<Props> = ({ containerClassName, streamer }) => {
  const cls = useStyles();
  const thumbUrl = useMemo(() => parseUrl(streamer.stream.thumbnailUrl, TWITCH_SIZES.w320), []);

  return (
    <div className={cx(cls.container, containerClassName)}>
      <AspectRatio aspectRatio={{ width: 16, height: 10 }} className={cls.imgContainer}>
        <div className={cls.header}>
          <div className={cls.viewersCard}>
            <div className={cls.viewersCardMain}>
              <Show set="light" size="small" />
              <div style={{ width: spacers.get(0.25) }} />
              <Text size="small1">{streamer.stream.viewerCount} viewers</Text>
            </div>
            <div className={cls.blur} />
          </div>
        </div>
        <img src={thumbUrl} className={cls.img} />
        <div className={cls.tintOverlay} />
        <div className={cls.footer}>
          <div className={cls.streamInfo}>
            <div className={cls.streamInfoLeftSide}>
              <Avatar imageUrl={streamer.profileImageUrl || ''} size={54} className={cls.avatar} />
            </div>
            <div className={cls.streamInfoMain}>
              <Text size="subtitle2">{streamer.displayName}</Text>
              <div>
                <Text size="small1">{streamer.stream.title.slice(0, 28)}...</Text>
              </div>
            </div>
          </div>
          <div className={cls.blur} />
        </div>
      </AspectRatio>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid rgba(255, 255, 255, .1)`,
    background: theme.name === 'lightDefault' ? theme.colors.neutralDark : theme.colors.neutralDark,
    ...hardBorderRadius,
    overflow: 'hidden',
    ...theme.floatingShadow,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 98,
    padding: spacers.small,
  },
  viewersCard: {
    position: 'relative',
    display: 'inline-block',
    ...hardBorderRadius,
    overflow: 'hidden',
    padding: `${spacers.get(0.25)}`,
  },
  viewersCardMain: {
    position: 'relative',
    zIndex: 9,
    display: 'flex',
    alignItems: 'center',
  },

  imgContainer: {},
  img: {
    width: '100%',
    filter: 'brightness(80%)',
  },

  streamInfo: {
    display: 'flex',
    zIndex: 99,
    position: 'relative',
    paddingLeft: spacers.small,
    paddingRight: spacers.small,
  },
  streamInfoLeftSide: {
    paddingRight: spacers.small,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },

  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#5A20FE',
    opacity: 0.3,
  },

  streamInfoMain: {
    paddingTop: spacers.get(0.25),
  },
  avatar: {
    transform: 'translateY(-15%)',
  },

  blur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, .15)',
    borderTop: `1px solid rgba(255, 255, 255, .1)`,
    overflow: 'hidden',
  },
}));
