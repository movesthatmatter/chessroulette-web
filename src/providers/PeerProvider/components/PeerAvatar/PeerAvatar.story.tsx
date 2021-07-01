import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { PeerAvatar } from './PeerAvatar';

export default {
  component: PeerAvatar,
  title: 'providers/PeerProvider/components/PeerAvatar',
};

const peerMocker = new PeerMocker();

export const defaultStory = () => (
  <StorybookReduxProvider>
    <Grommet theme={defaultTheme}>
      <PeerAvatar peer={peerMocker.record()} size="120px" />
    </Grommet>
  </StorybookReduxProvider>
);
