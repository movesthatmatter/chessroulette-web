import React from 'react';
import { PlayWithFriendsPopup } from './PlayWithFriendsPopup';

export default {
  component: PlayWithFriendsPopup,
  title: 'Components/Play with Friends Popup',
};

export const Popup = () => (
  <div style={{ display: 'flex', width: '300px' }}>
    <PlayWithFriendsPopup close={() => console.log('close')} dispatchCode={(value) => console.log(value)} />
  </div>
);
