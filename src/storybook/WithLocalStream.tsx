import React, { useState, useEffect } from 'react';
import { getAVStreaming } from 'src/services/AVStreaming';

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
    const client = getAVStreaming();

    (async () => {
      const stream = await client.getStream(constraints);

      setLocalStream(stream);
    })();

    return () => {
      if (localStream) {
        client.stopStream(localStream);
      }
    };
  }, []);

  if (!localStream) {
    return null;
  }

  return <>{render(localStream)}</>;
};
