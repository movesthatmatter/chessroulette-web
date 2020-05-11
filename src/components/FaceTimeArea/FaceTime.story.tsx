import React, { useState, useEffect } from 'react';
import { AVStreaming } from 'src/services/AVStreaming';
import { FaceTime } from './FaceTime';

export default {
  component: FaceTime,
  title: 'components/FaceTime/FaceTime',
};

const streamClient = new AVStreaming();

export const defaultStory = () => React.createElement(() => {
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
    <div style={{ width: '480px' }}>
      <FaceTime
        streamConfig={{
          on: true,
          type: 'audio-video',
          stream,
        }}
        aspectRatio={{ width: 16, height: 9 }}
        muted
      />
    </div>
  );
});
