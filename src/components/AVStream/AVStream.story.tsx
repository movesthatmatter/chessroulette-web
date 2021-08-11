import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { AvStream } from './AvStream';

export default {
  component: AvStream,
  title: 'components/AvStream',
};

export const defaultStory = () => (
  <WithLocalStream
    render={(stream) => (
      <AvStream
        stream={stream}
        autoPlay
        muted
      />
    )}
  />
);
