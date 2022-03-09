import React, { useMemo } from 'react';
import { AspectRatio, AspectRatioExplicit } from 'src/components/AspectRatio';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { hardBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Math } from 'window-or-global';
import { Show } from 'react-iconly';
import { InfoCard } from 'src/components/InfoCard';
import { noop } from 'src/lib/util';
import { Button } from 'src/components/Button';
import cx from 'classnames';
import { LiveStreamer } from '../../types';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';

type Props = {
  streamer: LiveStreamer;
  containerClassName?: string;
  onClick?: () => void;
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

const shortenText = (text: string, length: number, suffix = '...') =>
  text.length > length ? `${text.slice(0, length)}${suffix}` : text;

export const LiveStreamCard: React.FC<Props> = ({
  containerClassName,
  streamer,
  onClick = noop,
}) => {
  const cls = useStyles();
  const thumbUrl = useMemo(() => parseUrl(streamer.stream.thumbnailUrl, TWITCH_SIZES.w320), []);
  const device = useDeviceSize();

  const avatarSize = useMemo(() => device.isDesktop ? 54 : 36, [device]);

  return (
    <div className={cx(cls.container, containerClassName)}>
      <InfoCard
        containerClassName={cls.infoCardContainer}
        top={
          <AspectRatio aspectRatio={{ width: 16, height: 9 }} className={cls.imgContainer}>
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
          </AspectRatio>
        }
        bottomClassName={cls.infoContainer}
        bottom={
          <>
            <div className={cls.infoTop}>
              <div className={cls.infoUsername}>
                <Text size="subtitle2">{streamer.displayName}</Text>
              </div>
              <Avatar imageUrl={streamer.profileImageUrl || ''} size={avatarSize} className={cls.avatar} />
            </div>
            <div className={cls.infoMain}>
              <Text size="small1">{shortenText(streamer.stream.title, 120)}</Text>
            </div>
            <br />
          </>
        }
      />
      <div className={cls.overlay}>
        <div className={cls.overlayContent}>
          <Button label="Watch" onClick={onClick} />
        </div>
        {/* <div className={cls.overlayBkg} /> */}
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    position: 'relative',
    flex: 1,
    display: 'flex',

    ...({
      '&:hover $overlay': {
        display: 'flex',
      },
    } as NestedCSSElement),
  },

  infoCardContainer: {
    flex: 1,
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

  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    zIndex: 99,
    position: 'relative',
    paddingTop: 0,
  },
  streamInfoLeftSide: {},

  infoTop: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.name === 'darkDefault' ? '#5A20FE' : '#fff',
    opacity: 0.3,
  },

  infoMain: {
    marginTop: `-${spacers.small}`,
  },
  infoUsername: {
    paddingTop: spacers.small,
    paddingRight: spacers.small,
  },

  avatar: {
    transform: 'translateY(-50%)',
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

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 0, 0, .2)',
    zIndex: 999,
    display: 'none',

    ...hardBorderRadius,
    overflow: 'hidden',
  },
  overlayContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
