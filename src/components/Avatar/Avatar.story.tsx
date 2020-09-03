/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Box } from 'grommet';
import { Avatar } from './Avatar';

export default {
  component: Avatar,
  title: 'components/Avatar',
};

export const defaultStory = () => (
  <Box>
    <Avatar id="2" width={50} />
    <Avatar id="4" width={50} />
    <Avatar id="5" width={50} />
    <Avatar id="1" width={50} />
    <Avatar id="9" width={50} />
  </Box>
);
