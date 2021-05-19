import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Button } from 'src/components/Button';
import { defaultTheme } from 'src/theme';
import { WithDialog } from './WithDialog';

export default {
  component: WithDialog,
  title: 'components/Dialog/WithDialog',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
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
  </Grommet>
);
