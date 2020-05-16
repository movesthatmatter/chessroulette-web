/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { PopupContent } from './PopupContent';


export default {
  component: PopupContent,
  title: 'Components/Popups/PopupContent',
};

export const defaultStory = () => (
  <PopupContent
    hasCloseButton
    onClose={action('on close')}
  >
    works
  </PopupContent>
);
