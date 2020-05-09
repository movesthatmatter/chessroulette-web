import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AVStream } from '../AVStream';

type Props = {
  // Does it need to be different for audio only?
  streamConfig:
  | { on: false }
  | {
    on: true;
    type: 'audio' | 'video' | 'audio-video';
    stream: MediaStream;
  };
};

export const FaceTime: React.FC<Props> = ({ streamConfig }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {streamConfig.on ? (
        <>
          <div>{`Streaming On ${streamConfig.type}`}</div>
          <AVStream
            stream={streamConfig.stream}
            autoPlay
            muted
            className={cls.container}
          />
        </>
      ) : (
        <span>Streaming Off</span>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '200px',
    height: '200px',
    background: '#efefef',
  },
});
