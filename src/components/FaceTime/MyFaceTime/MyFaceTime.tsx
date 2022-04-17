import React, { useEffect, useState } from 'react';
import { getAVStreaming, AVStreamingConstraints, AVStreaming } from 'src/services/AVStreaming';
import { FaceTime, FaceTimeProps } from '../FaceTime/FaceTime';
import useInstance from '@use-it/instance';
import { PeerStreamingConfig } from 'src/providers/PeerConnectionProvider';

type Props = Omit<FaceTimeProps, 'streamConfig'> & {
  constraints?: AVStreamingConstraints;
};

// Automatically opens a local stream
export const MyFaceTime: React.FC<Props> = ({
  mirrorImage = true, // by defualt it's mirrored
  ...props
}) => {
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);
  const [myStreamConfig, setMyStreamConfig] = useState<PeerStreamingConfig>({ on: false });

  useEffect(() => {
    if (myStreamConfig.on) {
      return;
    }

    const streamPromise = AVStreaming.getStream().then((stream) => {
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
    };
  }, []);

  return <FaceTime streamConfig={myStreamConfig} muted mirrorImage={mirrorImage} {...props} />;
};
