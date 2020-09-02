import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { PeerStreamingConfig } from 'src/services/peers';
import { AVStream, AVStreamProps } from '../AVStream';

export type FaceTimeProps = Omit<AVStreamProps, 'stream'> & {
  // Does it need to be different for audio only?
  aspectRatio?: {
    width: number;
    height: number;
  };
  streamConfig: PeerStreamingConfig;
  containerClassName?: string;

  streamingOffFallback?: React.ReactNode;
};

export const FaceTime: React.FC<FaceTimeProps> = ({
  streamConfig,
  className,
  streamingOffFallback,
  containerClassName,
  ...avStreamProps
}) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, containerClassName)}>
      {streamConfig.on
        ? (
          <AVStream
            stream={streamConfig.stream}
            autoPlay
            className={cx(cls.video, className)}
            {...avStreamProps}
          />
        )
        : (streamingOffFallback)}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  video: {
    width: '100%',
    height: 'auto', // to make sure it maintains the aspect ratio
  },
});
