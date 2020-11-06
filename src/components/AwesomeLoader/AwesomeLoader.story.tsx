import { Box } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { AwesomeLoader } from './AwesomeLoader';
import { AwesomeLoaderPage } from './AwesomeLoaderPage';


export default {
  component: AwesomeLoaderPage,
  title: 'Components/AwesomeLoader',
};

export const defaultStory = () => (
  <div style={{
    width: '300px',
  }}>
    <AwesomeLoader />
  </div>
);

export const asPage = () => (
  <AwesomeLoaderPage />
);

export const minimal = () => (
  <div style={{
    width: '100px',
  }}>
    <AwesomeLoader minimal />
  </div>
);
