/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { Button } from './Button';

export default {
  component: Button,
  title: 'components/Button',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box align="center" pad="medium">
      <Button
        label="Primary Filled Horizontally"
        fill="horizontal"
        onClick={action('on click')}
        primary
      />
    </Box>
    <Box align="center" pad="medium">
      <Button
        label="Primary"
        onClick={action('on click')}
        primary
      />
    </Box>
    <Box align="center" pad="medium">
      <Button
        label="Secondary"
        onClick={action('on click')}
        secondary
      />
    </Box>
    <Box align="center" pad="medium">
      <Button
        label="Default"
        onClick={action('on click')}
      />
    </Box>
    <Box align="center" pad="medium">
      <Button
        label="Active"
        onClick={action('on click')}
        active
      />
    </Box>
    <Box align="center" pad="medium">
      <Button
        label="Active Primary"
        onClick={action('on click')}
        active
        primary
      />
    </Box>
    <Box align="center" pad="medium">
      <Button
        label="Active Secondary"
        onClick={action('on click')}
        active
        secondary
      />
    </Box>
  </Grommet>
);
