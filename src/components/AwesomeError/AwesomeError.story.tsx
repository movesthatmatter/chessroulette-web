/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { AwesomeError } from './AwesomeError';
import { AwesomeErrorPage } from './AwesomeErrorPage';


export default {
  component: AwesomeError,
  title: 'components/AwesomeError',
};

export const defaultStory = () => (
    <AwesomeError />
);

export const asPage = () => (
    <AwesomeErrorPage />
);
