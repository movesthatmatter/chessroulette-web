import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { AVStream } from './AVStream';

export default {
  component: AVStream,
  title: 'Components/AVStream',
};

export const withWebcam = () => (
  <WithLocalStream
    render={(stream) => (
      <AVStream
        stream={stream}
        autoPlay
        muted
      />
    )}
  />
);
