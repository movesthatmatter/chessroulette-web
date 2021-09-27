/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { CreateChallenge } from './CreateChallenge';

export default {
  component: CreateChallenge,
  title: 'modules/Challenges/components/Create Challenge',
};

export const defaultStory = () => (
  <div
    style={{
      textAlign: 'center',
      alignContent: 'center',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <CreateChallenge
      gameSpecs={{
        timeLimit: 'blitz3',
        preferredColor: 'black',
      }}
      onUpdated={action('on update')}
    />
  </div>
);
