/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { Text } from 'grommet';
import React, { useState } from 'react';
import { Button } from '../Button';
import { DarkModeSwitch } from '../DarkModeSwitch/DarkModeSwitch';
import { Dialog } from './Dialog';

export default {
  component: Dialog,
  title: 'components/Dialog',
};

export const startOpen = () => (
  <>
    <Dialog
      visible
      title="How are you?"
      content={<><Text>"I hope everything is alight!"</Text><br/><DarkModeSwitch/></>}
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
  </>
);

export const withLongTitle = () => (
  <>
    <Dialog
      visible
      title="How are you? This should be a super long title"
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
  </>
);

export const withContentAsHtml = () => (
  <>
    <Dialog
      visible
      title="How are you? This should be a super long title"
      content={{
        __html:
          'This is an html. It accepts <b>bold</b> or <i>italic</i> or any <strike>other</strike> <code>html code</code>',
      }}
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
  </>
);

export const openOnDemand = () =>
  React.createElement(() => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button label="Open" onClick={() => setShow(true)} />
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
          onClose={() => {
            setShow(false);
            action('on close')();
          }}
        />
      </>
    );
  });

export const with3buttons = () =>
  React.createElement(() => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button label="Open" onClick={() => setShow(true)} />
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
      </>
    );
  });
