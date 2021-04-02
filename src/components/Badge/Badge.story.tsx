import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { Badge } from './Badge';

export default {
  component: Badge,
  title: 'components/Badge',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <Badge color="negative" text="New" />
  </Grommet>
);
