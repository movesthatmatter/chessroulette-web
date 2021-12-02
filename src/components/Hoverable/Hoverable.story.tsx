import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Hoverable } from './Hoverable';

export default {
  component: Hoverable,
  title: 'components/Hoverable',
};

export const defaultStory = () => (
  <Hoverable
    overlayButtonProps={{
      label: 'Open',
      onClick: action('on click'),
    }}
  >
    <div>
      Works
    </div>
  </Hoverable>
);
