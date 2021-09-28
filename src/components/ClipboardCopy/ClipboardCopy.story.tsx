/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ClipboardCopy } from './ClipboardCopy';
import { action } from '@storybook/addon-actions';

export default {
  component: ClipboardCopy,
  title: 'components/ClipboardCopy',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box width="large">
      <ClipboardCopy
        value="Press on the button to copy me"
        onCopied={action('copied')}
      />
    </Box>
  </Grommet>
);

export const withAutoCopy = () => (
  <Grommet theme={defaultTheme} full>
    <Box width="large">
      <ClipboardCopy
        value="This should auto copy"
        autoCopy
        onCopied={action('copied')}
      />
    </Box>
  </Grommet>
);


export const readonly = () => (
  <Grommet theme={defaultTheme} full>
    <Box width="large">
      <ClipboardCopy
        value="This should auto copy"
        autoCopy
        onCopied={action('copied')}
        readonly
      />
    </Box>
  </Grommet>
);
