/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { MobileRoomLayout } from './MobileLayout';

export default {
  component: MobileRoomLayout,
  title: 'modules/Room/LayoutProvider/Room/Mobile',
};

export const defaultStory = () => (
  <MobileRoomLayout
    getTopArea={() => (
      <div
        style={{
          background: 'purple',
        }}
      />
    )}
    getMainArea={() => (
      <div
        style={{
          background: 'blue',
        }}
      />
    )}
  />
);
