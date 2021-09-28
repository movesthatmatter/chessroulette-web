import React, { useRef, useEffect } from 'react';
import { logsy } from 'src/lib/logsy';
import { setTimeout } from 'window-or-global';

type VideoAttributes = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>;

export type VideoBoxProps = VideoAttributes & {
  onMounted: (ref: HTMLVideoElement) => void;
};

export const VideoElement: React.FunctionComponent<VideoBoxProps> = ({
  onMounted,
  className,
  ...videoProps
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fn = () => {
      if (videoRef.current) {
        logsy.log('Video Element: Video ref present!');
        onMounted(videoRef.current);
      } else {
        logsy.log('Video Element: Video ref not present yet. Going to retry in 250ms!');
        setTimeout(fn, 250);
      }
    };

    fn();
  }, []);

  return (
    <video ref={videoRef} className={className} autoPlay playsInline {...videoProps}>
      <track kind="main" />
    </video>
  );
};
