import React, { useEffect, useState } from 'react';
import { getAVStreaming, AVStreamingConstraints, AVStreaming } from 'src/services/AVStreaming';
import { PeerStreamingConfig } from 'src/services/peers';
import { FaceTime, FaceTimeProps } from './FaceTime/FaceTime';
import useInstance from '@use-it/instance';

type Props = Omit<FaceTimeProps, 'streamConfig'> & {
  constraints?: AVStreamingConstraints;
};

// Automatically opens a local stream
export const MyFaceTime: React.FC<Props> = ({
  constraints = {
    audio: true,
    video: true,
  },
  ...props
}) => {
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);
  const [myStreamConfig, setMyStreamConfig] = useState<PeerStreamingConfig>({ on: false });

  useEffect(() => {
    if (myStreamConfig.on) {
      return;
    }

    const streamPromise = AVStreaming.getStream(constraints).then((stream) => {
      setMyStreamConfig({
        on: true,
        type: 'audio-video',
        stream,
      });

      return stream;
    });

    return () => {
      streamPromise.then((stream) => {
        AVStreaming.destroyStreamById(stream.id);
      });
    }
  }, []);

  return (
    <FaceTime 
      streamConfig={myStreamConfig}
      muted
      {...props}
    />
  );
};