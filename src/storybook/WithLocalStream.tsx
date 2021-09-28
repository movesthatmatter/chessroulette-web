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
      client.updateConstraints(constraints);
      const stream = await client.getStream();

      setLocalStream(stream);
    })();

    return () => {
      if (localStream) {
        client.destroyStreamById(localStream.id);
      }
    };
  }, []);

  if (!localStream) {
    return null;
  }

  return <>{render(localStream)}</>;
};
