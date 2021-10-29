/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Avatar } from './Avatar';

export default {
  component: Avatar,
  title: 'components/Avatar',
};

export const defaultStory = () => (
  <div>
    <Avatar mutunachiId={2} size="128px" />
    <br/>
    <Avatar mutunachiId={4} />
    <br/>
    <Avatar mutunachiId={5} size="200px" />
    <br/>
    <Avatar mutunachiId={1} />
    <br/>
    <Avatar mutunachiId={9} size="32px" />
  </div>
);
