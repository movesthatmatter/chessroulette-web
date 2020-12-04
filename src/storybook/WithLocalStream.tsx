import React, { useState, useEffect } from 'react';
import { AVStreaming } from 'src/services/AVStreaming';

type Props = {
  constraints?: { audio: boolean; video: boolean };
  render: (stream: MediaStream) => React.ReactNode;
};

export const WithLocalStream: React.FC<Props> = ({
  constraints = { audio: false, video: true },
  render,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const client = new AVStreaming();

    (async () => {
      const stream = await client.start({
        audio: true,
        video: true,
      });

      console.log('settings', stream.getVideoTracks()[0].getSettings());
      // console.log('constraings', constraints);
      setLocalStream(stream);
    })();

    return () => {
      if (localStream) {
        client.stop(localStream);
      }
    };
  }, []);

  if (!localStream) {
    return null;
  }

  return <>{render(localStream)}</>;
};
