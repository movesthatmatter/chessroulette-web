/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StreamerRecordMocker } from 'src/mocks/records/StreamerRecordMocker';
import { StreamerProfileCard } from './StreamerProfileCard';

export default {
  component: StreamerProfileCard,
  title: 'modules/Live/components/StreamerProfileCard',
};

const streamerMocker = new StreamerRecordMocker();

export const defaultStory = () => <StreamerProfileCard streamer={streamerMocker.record(false)} />;

export const compact = () => <StreamerProfileCard streamer={streamerMocker.record(false)} compact />;
