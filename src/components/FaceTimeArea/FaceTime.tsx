import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AVStream, AVStreamProps } from '../AVStream';

type Props = Omit<AVStreamProps, 'stream'> & {
  // Does it need to be different for audio only?
  aspectRatio?: {
    width: number;
    height: number;
  };
  streamConfig:
  | { on: false }
  | {
    on: true;
    type: 'audio' | 'video' | 'audio-video';
    stream: MediaStream;
  };
};

export const FaceTime: React.FC<Props> = ({
  streamConfig,
  aspectRatio = {
    width: 16,
    height: 9,
  },
  ...avStreamProps
}) => {
  const cls = useStyles();

  return (
    <div
      className={cls.container}
      style={{ paddingBottom: `${100 / (aspectRatio.width / aspectRatio.height)}%` }}
    >
      {streamConfig.on ? (
        <AVStream
          stream={streamConfig.stream}
          autoPlay
          className={cls.video}
          {...avStreamProps}
        />
      ) : (
        <span>Streaming Off</span>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
