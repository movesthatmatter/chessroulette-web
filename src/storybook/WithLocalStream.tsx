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
      setLocalStream(await client.start(constraints));
    })();

    return () => {
      client.stop();
    };
  }, []);

  if (!localStream) {
    return null;
  }

  return <>{render(localStream)}</>;
};
