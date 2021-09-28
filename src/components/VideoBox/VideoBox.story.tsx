import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { VideoBox } from './VideoBox';

export default {
  component: VideoBox,
  title: 'components/VideoBox',
};

export const defaultStory = () => (
  <WithLocalStream
    render={(stream) => (
      <VideoBox
        stream={stream}
        autoPlay
        muted
      />
    )}
  />
);
