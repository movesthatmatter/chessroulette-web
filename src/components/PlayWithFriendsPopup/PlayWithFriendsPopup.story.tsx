/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { PlayWithFriendsPopup } from './PlayWithFriendsPopup';

export default {
  component: PlayWithFriendsPopup,
  title: 'Components/Popups/Play with Friends Popup',
};

export const Popup = () => (
  // <div style={{ display: 'flex', width: '300px' }}>
  <PlayWithFriendsPopup
    close={action('close')}
    dispatchCodeJoin={action('dispatch code join')}
    dispatchCreate={action('dispatch create')}
  />
  // </div>
);
