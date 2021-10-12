/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { PeerAvatar } from './PeerAvatar';

export default {
  component: PeerAvatar,
  title: 'providers/PeerProvider/components/PeerAvatar',
};

const peerMocker = new PeerMocker();

export const defaultStory = () => (
  <StorybookReduxProvider>
      <PeerAvatar peer={peerMocker.record()} size="120px" />
  </StorybookReduxProvider>
);
