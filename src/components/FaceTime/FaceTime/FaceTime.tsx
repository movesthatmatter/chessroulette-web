import React, { ReactNode, useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { VideoBox, VideoBoxProps } from 'src/components/VideoBox';
import { CustomTheme, fonts, onlyMobile } from 'src/theme';
import { Text } from 'src/components/Text';
import { AspectRatio, AspectRatioProps } from 'src/components/AspectRatio';
import { colors } from 'src/theme/colors';
import { PeerStreamingConfig } from 'src/providers/PeerProvider';
import Loader from 'react-loaders';
import 'loaders.css';

export type FaceTimeProps = Omit<VideoBoxProps, 'stream'> & {
  streamConfig: PeerStreamingConfig;
  streamingOffFallback?: ReactNode;
  loadingFallback?: ReactNode;

  aspectRatio?: AspectRatioProps['aspectRatio'];
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
  loadingFallback = null,
  ...avStreamProps
}) => {
  const cls = useStyles();
  const [loadingVideo, setLoadingVideo] = useState(true);

  const loader = (
    <div className={cls.loadingWrapper}>
      {loadingFallback || (
        <div className={cls.loader}>
          <Loader type="line-scale-pulse-out" active innerClassName={cls.loader} />
        </div>
      )}
    </div>
  );

  return (
    <div className={cx(cls.container, containerClassName)}>
      <AspectRatio aspectRatio={aspectRatio}>
        {streamConfig.on ? (
          <>
            <VideoBox
              stream={streamConfig.stream}
              autoPlay
              className={cx(cls.video, className)}
              {...avStreamProps}
              onCanPlay={() => {
                setLoadingVideo(false);
              }}
            />
            {loadingVideo && loader}
          </>
        ) : (
          streamingOffFallback || loader
        )}
        <div className={cls.overlayedContainer}>
          {headerOverlay && <div className={cls.headerWrapper}>{headerOverlay}</div>}
          <div className={cls.mainWrapper}>{mainOverlay}</div>
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

const useStyles = createUseStyles<CustomTheme>((theme) => ({
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
    zIndex: 9,
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
    zIndex: 99,
  },
  labelWrapperLeft: {
    textAlign: 'left',
  },
  labelWrapperRight: {
    textAlign: 'right',
  },
  label: {
    color: colors.universal.white,
    ...fonts.subtitle1,

    paddingLeft: '12px',
    paddingRight: '12px',
    paddingBottom: '6px',

    ...onlyMobile({
      paddingLeft: '8px',
      paddingBottom: '2px',
    }),
  },
  loadingWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 99,
    display: 'flex',
  },
  loader: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
