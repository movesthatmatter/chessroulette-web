import React, { useState, useEffect } from 'react';
import { LocalStreamClient } from 'src/services/peer2peer/LocalStreamClient';
import { AVStream } from './AVStream';

export default {
  component: AVStream,
  title: 'Components/AVStream',
};

const streamClient = new LocalStreamClient();

export const withWebcam = () => React.createElement(() => {
  const [stream, setStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    (async () => {
      setStream(await streamClient.start());
    })();
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
