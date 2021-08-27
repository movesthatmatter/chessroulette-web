import React, { useRef, useEffect } from 'react';
import config from 'src/config';

type VideoAttributes =
  React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;

export type VideoBoxProps = VideoAttributes & {
  stream: MediaStream;
};

export const VideoBox: React.FunctionComponent<VideoBoxProps> = ({
  stream,
  ...videoProps
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      // Ensure the stream isn't used by this video anymore!
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream.id]);

  return (
    <video
      // Make sure the video refreshes if the stream id changes
      key={stream.id}
      ref={videoRef}

      // Hardcode this here for now to stop the hallow effect in dev mode
      // But let them be overwritten by specifc props
      {
        ...(config.ENV === 'dev') && {
          muted: true,
        }
      }

      {...videoProps}
      autoPlay
      playsInline
    >
      <track kind="main" />
    </video>
  );
};
