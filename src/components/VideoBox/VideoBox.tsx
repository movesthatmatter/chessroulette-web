import React from 'react';
import config from 'src/config';
import { createUseStyles } from 'src/lib/jss';
import { VideoElement } from './VideoElement';
import cx from 'classnames';

type VideoAttributes = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>;

export type VideoBoxProps = VideoAttributes & {
  stream: MediaStream;
};

export const VideoBox: React.FunctionComponent<VideoBoxProps> = ({
  stream,
  className,
  ...videoProps
}) => {
  const cls = useStyles();

  return (
    <VideoElement
      // Make sure the video refreshes if the stream id changes
      key={stream.id}
      className={cx(cls.video, className)}
      // Hardcode this here for now to stop the hallow effect in dev mode
      // But let them be overwritten by specifc props
      {...(config.ENV === 'dev' && {
        muted: true,
      })}
      {...videoProps}
      onMounted={(ref) => {
        ref.srcObject = stream;
      }}
    />
  );
};

const useStyles = createUseStyles({
  video: {
    transform: 'rotateY(180deg)',
  },
});
