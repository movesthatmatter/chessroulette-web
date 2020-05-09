import React, { useState, useEffect } from 'react';
import { AVStreaming } from 'src/services/AVStreaming';
import { AVStream } from './AVStream';

export default {
  component: AVStream,
  title: 'Components/AVStream',
};

const streamClient = new AVStreaming();

export const withWebcam = () => React.createElement(() => {
  const [stream, setStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    (async () => {
      setStream(await streamClient.start());
    })();

    return () => {
      streamClient.stop();
    };
  }, []);

  if (!stream) {
    return (
      <div>Loading Stream...</div>
    );
  }

  return (
    <AVStream
      stream={stream}
      autoPlay
      muted
    />
  );
});
