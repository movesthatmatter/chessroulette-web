/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
import React, { useState } from 'react';
import { defaultTheme } from 'src/theme';
import { Button } from '../Button';
import { Dialog } from './Dialog';

export default {
  component: Dialog,
  title: 'components/Dialog',
};

export const startOpen = () => (
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

export const openOnDemand = () => React.createElement(() => {
  const [show, setShow] = useState(false);

  return (
    <Grommet theme={defaultTheme}>
      <Button
        label="Open"
        onClick={() => setShow(true)}
      />
      <Dialog
        visible={show}
        title="How are you?"
        content="I hope everything is alight!"
        buttons={[
          {
            label: 'Cancel',
            type: 'secondary',
            onClick: () => setShow(false),
          },
          {
            label: 'Okay',
            type: 'primary',
            onClick: action('Okay'),
          },
        ]}
        onClose={() => setShow(false)}
      />
    </Grommet>
  );
});

export const with3buttons = () => React.createElement(() => {
  const [show, setShow] = useState(false);

  return (
    <Grommet theme={defaultTheme}>
      <Button
        label="Open"
        onClick={() => setShow(true)}
      />
      <Dialog
        visible={show}
        title="How are you?"
        content="I hope everything is alight!"
        buttons={[
          {
            label: 'Cancel',
            type: 'secondary',
            onClick: () => setShow(false),
          },
          {
            label: 'Okay',
            type: 'primary',
            onClick: action('Okay'),
          },
          {
            label: 'Hmm..',
            type: 'primary',
            clear: true,
            onClick: action('Okay'),
          },
        ]}
        onClose={() => setShow(false)}
      />
    </Grommet>
  );
});