import React, { ReactNode } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { PeerStreamingConfig } from 'src/services/peers';
import { VideoBox, VideoBoxProps } from 'src/components/VideoBox';
import { CustomTheme, fonts, onlyMobile } from 'src/theme';
import { Text } from 'src/components/Text';
import { AspectRatio, AspectRatioProps } from 'src/components/AspectRatio';
import { console } from 'window-or-global';

export type FaceTimeProps = Omit<VideoBoxProps, 'stream'> & {
  aspectRatio?: AspectRatioProps['aspectRatio'];
  streamConfig: PeerStreamingConfig;
  streamingOffFallback?: React.ReactNode;

  containerClassName?: string;
  label?: string;
  labelClassName?: string;
  labelPosition?: 'bottom-left' | 'bottom-center' | 'bottom-right';

  headerOverlay?: ReactNode;
  mainOverlay?: ReactNode;
  footerOverlay?: ReactNode;
};

export const FaceTime: React.FC<FaceTimeProps> = ({
  streamConfig,
  className,
  streamingOffFallback,
  containerClassName,
  label,
  footerOverlay,
  mainOverlay,
  headerOverlay,
  labelClassName = null,
  labelPosition = 'bottom-center',
  aspectRatio = {
    width: 4,
    height: 3,
  },
  ...avStreamProps
}) => {
  const cls = useStyles();

  // useEffect(() => {
  // }, [
  //   streamConfig
  // ]);
  // console.log('FacetimeStreaming config updated', streamConfig);

  return (
    <div className={cx(cls.container, containerClassName)}>
      <AspectRatio aspectRatio={aspectRatio}>
        {streamConfig.on ? (
          <VideoBox
            stream={streamConfig.stream}
            autoPlay
            className={cx(cls.video, className)}
            {...avStreamProps}
          />
        ) : (
          streamingOffFallback
        )}
        <div className={cls.overlayedContainer}>
          {headerOverlay && <div className={cls.headerWrapper}>{headerOverlay}</div>}
          <div className={cls.mainWrapper}>
            {mainOverlay}
          </div>
          <div className={cls.footerWrapper}>
            {label && (
              <div
                className={cx(
                  cls.labelWrapper,
                  labelPosition === 'bottom-left' && cls.labelWrapperLeft,
                  labelPosition === 'bottom-right' && cls.labelWrapperRight
                )}
              >
                <Text className={cx(cls.label, labelClassName)}>{label}</Text>
              </div>
            )}
            {footerOverlay}
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    position: 'relative',
  },
  overlayedContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,

    display: 'flex',
    flexDirection: 'column',
  },
  mainWrapper: {
    flex: 1,
  },
  footerWrapper: {},
  headerWrapper: {},
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  labelWrapper: {
    position: 'relative',
    textAlign: 'center',
  },
  labelWrapperLeft: {
    textAlign: 'left',
  },
  labelWrapperRight: {
    textAlign: 'right',
  },
  label: {
    color: theme.colors.white,
    ...fonts.subtitle1,

    paddingLeft: '12px',
    paddingRight: '12px',
    paddingBottom: '6px',

    ...onlyMobile({
      paddingLeft: '8px',
      paddingBottom: '2px',
    }),
  },
}));
