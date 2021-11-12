import { ResourceRecords, Resources } from 'dstnd-io';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { console } from 'window-or-global';
import { StreamerCard } from './StreamerCard';

export default {
  component: StreamerCard,
  title: 'modules/live/components/StreamerCard',
};

const featuredStreamers = require('./__mocks__/featured.json')
  .data as Resources.Collections.Watch.GetLiveStreamers.OkResponse;

// console.log('mocksJSON', mocksJSON);

// const featuredStreamers =

export const defaultStory = () => <StreamerCard streamer={featuredStreamers.items[0]} />;

export const reel = () =>
  featuredStreamers.items.map((streamer) => <StreamerCard streamer={streamer} />);
