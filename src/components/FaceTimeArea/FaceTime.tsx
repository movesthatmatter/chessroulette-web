import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { PeerStreamingConfig } from 'src/services/peers';
import { AVStream, AVStreamProps } from '../AVStream';
import { colors, fonts } from 'src/theme';
import { Text } from 'src/components/Text';
import { AspectRatio } from '../AspectRatio';

export type FaceTimeProps = Omit<AVStreamProps, 'stream'> & {
  aspectRatio?: {
    width: number;
    height: number;
  };
  streamConfig: PeerStreamingConfig;
  streamingOffFallback?: React.ReactNode;

  containerClassName?: string;
  label?: string;
  labelClassName?: string;
  labelPosition?: 'bottom-left' | 'bottom-center' | 'bottom-right';
};

export const FaceTime: React.FC<FaceTimeProps> = ({
  streamConfig,
  className,
  streamingOffFallback,
  containerClassName,
  label,
  labelClassName = null,
  labelPosition = 'bottom-center',
  aspectRatio={
    width: 4,
    height: 3,
  },
  ...avStreamProps
}) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, containerClassName)}>
      <AspectRatio aspectRatio={aspectRatio}>
        {streamConfig.on
          ? (
            <AVStream
              stream={streamConfig.stream}
              autoPlay
              className={cx(cls.video, className)}
              {...avStreamProps}
            />
          )
          : (streamingOffFallback)
        }
        {label && (
          <div className={cx(
            cls.labelWrapper,
            labelPosition === 'bottom-left' && cls.labelWrapperLeft,
            labelPosition === 'bottom-right' && cls.labelWrapperRight,
          )}>
            <Text className={cx(cls.label, labelClassName)}>{label}</Text>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  labelWrapper: {
    position: 'absolute',
    left: '12px',
    right: '12px',
    bottom: '6px',
    textAlign: 'center',
  },
  labelWrapperLeft: {
    textAlign: 'left',
  },
  labelWrapperRight: {
    textAlign: 'right',
  },
  label: {
    color: colors.white,
    ...fonts.subtitle1,
  },
});
