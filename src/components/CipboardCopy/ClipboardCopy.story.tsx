/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ClipboardCopy } from './ClipboardCopy';

export default {
  component: ClipboardCopy,
  title: 'components/ClipboardCopy',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box width="large">
      <ClipboardCopy
        value="Press on the button to copy me"
      />
    </Box>
  </Grommet>
);
