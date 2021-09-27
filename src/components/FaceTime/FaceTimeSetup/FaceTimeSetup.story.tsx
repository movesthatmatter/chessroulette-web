/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { FaceTimeSetup } from './FaceTimeSetup';

export default {
  component: FaceTimeSetup,
  title: 'components/FaceTime/FaceTimeSetup',
};

export const defaultStory = () => (
    <div>
      <FaceTimeSetup onUpdated={action('on updated')} />
    </div>
);
