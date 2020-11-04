/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Box } from 'grommet';
import { Avatar } from './Avatar';
import { Mutunachi } from '../Mutunachi/Mutunachi';

export default {
  component: Avatar,
  title: 'components/Avatar',
};

export const defaultStory = () => (
  <Box>
    <Avatar>
      <Mutunachi mid="2"/>
    </Avatar>
    <Avatar>
      <Mutunachi mid="4"/>
    </Avatar>
    <Avatar>
      <Mutunachi mid="5"/>
    </Avatar>
    <Avatar>
      <Mutunachi mid="1"/>
    </Avatar>
    <Avatar>
      <Mutunachi mid="9"/>
    </Avatar>
  </Box>
);
