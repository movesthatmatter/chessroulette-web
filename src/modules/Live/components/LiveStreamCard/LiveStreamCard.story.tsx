/* eslint-disable import/no-extraneous-dependencies */
import { Resources } from 'chessroulette-io';
import React from 'react';
import { LiveStreamCard } from './LiveStreamCard';

export default {
  component: LiveStreamCard,
  title: 'modules/live/components/LiveStreamCard',
};

const featuredStreamers = require('./__mocks__/featured.json')
  .data as Resources.Collections.Watch.GetLiveStreamers.OkResponse;

export const defaultStory = () => (
  <div style={{ width: '320px' }}>
    <LiveStreamCard streamer={featuredStreamers.items[0]} />
  </div>
);

export const reel = () =>
  featuredStreamers.items.map((streamer) => <LiveStreamCard streamer={streamer} />);
