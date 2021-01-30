import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { LichessAuthButton } from './LichessAuthButton';

export default {
  component: LichessAuthButton,
  title: 'services/Authentication/LichessAuthButton',
};

export const defaultStory = () => <LichessAuthButton onSuccess={action('On Success')} />;
