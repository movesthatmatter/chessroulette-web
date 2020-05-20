import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { FaceTime } from './FaceTime';

export default {
  component: FaceTime,
  title: 'components/FaceTime/FaceTime',
};

export const defaultStory = () => React.createElement(() => (
  <div style={{ width: '480px' }}>
    <WithLocalStream
      render={(stream) => (
        <FaceTime
          streamConfig={{
            on: true,
            type: 'audio-video',
            stream,
          }}
          aspectRatio={{ width: 16, height: 9 }}
          muted
        />
      )}
    />
  </div>
));
