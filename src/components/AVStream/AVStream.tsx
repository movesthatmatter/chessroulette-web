import React, { useRef, useEffect } from 'react';
import config from 'src/config';

type VideoAttributes =
  React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;

export type AVStreamProps = VideoAttributes & {
  stream: MediaStream;
};

export const AVStream: React.FunctionComponent<AVStreamProps> = ({
  stream,
  ...videoProps
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <video
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
