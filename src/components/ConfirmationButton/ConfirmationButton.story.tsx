/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { action } from '@storybook/addon-actions';
import { ConfirmationButton } from './ConfirmationButton';

export default {
  component: ConfirmationButton,
  title: 'modules/Games/Chess/components/GameActionsWidget',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box width="medium">
      <ConfirmationButton
        label="Are you sure"
        confirmationPopupContent={(
          <>Are you sure?</>
        )}
        onSubmit={action('on submit')}
      />
      <ConfirmationButton
        label="Resign"
        confirmationPopupContent={(
          <>Resign?</>
        )}
        onSubmit={action('on submit')}
      />
    </Box>
  </Grommet>
);
