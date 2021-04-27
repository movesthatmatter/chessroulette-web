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
    <Avatar mutunachiId={2} size="128px" />
    <br/>
    <Avatar mutunachiId={4} />
    <br/>
    <Avatar mutunachiId={5} size="200px" />
    <br/>
    <Avatar mutunachiId={1} />
    <br/>
    <Avatar mutunachiId={9} size="32px" />
  </Box>
);
