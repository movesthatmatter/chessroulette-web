/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Badge } from './Badge';

export default {
  component: Badge,
  title: 'components/Badge',
};

export const defaultStory = () => (
    <Badge color="negative" text="New" />
);
