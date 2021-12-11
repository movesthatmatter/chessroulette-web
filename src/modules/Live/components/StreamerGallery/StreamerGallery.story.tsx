/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StreamerRecordMocker } from 'src/mocks/records/StreamerRecordMocker';
import { StreamerGallery } from './StreamerGallery';

export default {
  component: StreamerGallery,
  title: 'modules/Live/components/StreamerGallery',
};

const streamerMocker = new StreamerRecordMocker();

export const defaultStory = () => (
  <StreamerGallery
    streamers={[
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
    ]}
  />
);

export const compact = () => (
  <StreamerGallery
    compact
    streamers={[
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
      streamerMocker.record(false),
    ]}
  />
);
