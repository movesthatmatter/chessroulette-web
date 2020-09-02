/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StreamingBox } from './StreamingBox';

export default {
  component: StreamingBox,
  title: 'components/StreamingBox',
};

const peerMock = new PeerMocker();
const roomMocker = new RoomMocker();

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

      const publicRoom = roomMocker.withProps({
        me,
        peers: {
          [opponent.id]: opponent,
        },
        name: 'Valencia',
        type: 'public',
      });

      return (
        <Grommet theme={defaultTheme} full>
          <StreamingBox
            room={publicRoom}
            width={600}
          />
        </Grommet>
      );
    }}
  />

);