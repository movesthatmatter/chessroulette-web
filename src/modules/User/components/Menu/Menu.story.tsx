import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Menu } from './Menu';

export default {
  component: Menu,
  title: 'modules/UserProfile/Menu',
};

export const defaultStory = () => (
  <Menu
    current="userDetails"
    // onChange={action('on change')}
    sections={[
      {
        route: 'userDetails',
        display: 'User Details',
      },
    ]}
    activeLinkClassName=""
    linkClassName=""
    containerClassName=""
  />
);
