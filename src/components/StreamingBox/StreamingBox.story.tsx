/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { StreamingBox } from './StreamingBox';

export default {
  component: StreamingBox,
  title: 'components/StreamingBox',
};

const peerMock = new PeerMocker();

export const defaultStory = () => (
  <WithLocalStream
    render={(stream) => {
      const me = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const opponent = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      return (
        <Grommet theme={defaultTheme} full>
          <StreamingBox
            me={me}
            peer={opponent}
            width={600}
          />
        </Grommet>
      );
    }}
  />

);
