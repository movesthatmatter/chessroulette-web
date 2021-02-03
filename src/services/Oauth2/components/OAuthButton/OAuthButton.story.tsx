import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { OAuthButton } from './OAuthButton';

export default {
  component: OAuthButton,
  title: 'services/Authentication/LichessAuthButton',
};

export const defaultStory = () => (
  <OAuthButton
    vendor="facebook"
    label="OAuth Login"
    onSuccess={action('On Success')}
    getOauthUrl={() => Promise.resolve('asd')}
  />
);
