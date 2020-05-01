import React, { useRef, useEffect } from 'react';

type VideoAttributes =
  React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;

type Props = VideoAttributes & {
  stream: MediaStream;
};

export const AVStream: React.FunctionComponent<Props> = ({
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
      {...videoProps}
    >
      <track kind="captions" />
    </video>
  );
};
