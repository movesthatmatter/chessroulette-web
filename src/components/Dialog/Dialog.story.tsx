import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { Dialog } from './Dialog';

export default {
  component: Dialog,
  title: 'components/Dialog',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <Dialog
      visible
      title="How are you?"
      content="I hope everything is alight!"
      buttons={[
        {
          label: 'Cancel',
          type: 'secondary',
          onClick: action('Cancel'),
          size: 'small',
        },
        {
          label: 'Okay',
          type: 'primary',
          onClick: action('Okay'),
          size: 'small',
        },
      ]}
      onClose={action('on close')}
    />
  </Grommet>
);
