/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { MobileGameRoomLayout } from './MobileGameRoomLayout';


export default {
  component: MobileGameRoomLayout,
  title: 'modules/GameRoomV2/MobileGameRoomLayout',
};

export const defaultStory = () => (
  <MobileGameRoomLayout
    getTopArea={() => <div style={{
      background: 'purple',
    }}/>}
    getMainArea={() => <div style={{
      background: 'blue',
    }}/>}
  />
)