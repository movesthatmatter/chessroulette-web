import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Button } from 'src/components/Button';
import { WithDialog } from './WithDialog';

export default {
  component: WithDialog,
  title: 'components/Dialog/WithDialog',
};

export const defaultStory = () => (
    <WithDialog
      content="works"
      buttons={[
        (p) => ({
          type: 'secondary',
          label: 'Cancel',
          onClick: p.onClose.bind(p),
        }),
        (p) => ({
          type: 'primary',
          label: 'Submit',
          onClick: () => {
            action('on click');
            p.onClose();
          },
        }),
      ]}
      render={(p) => <Button label="Confirm" onClick={p.onOpen} />}
    />
);
