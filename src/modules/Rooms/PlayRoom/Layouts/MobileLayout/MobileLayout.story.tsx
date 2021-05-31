/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { MobileLayout } from './MobileLayout';


export default {
  component: MobileLayout,
  title: 'modules/Rooms/PlayRoom/MobileLayout',
};

export const defaultStory = () => (
  <MobileLayout
    getTopArea={() => <div style={{
      background: 'purple',
    }}/>}
    getMainArea={() => <div style={{
      background: 'blue',
    }}/>}
  />
)