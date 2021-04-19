import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { AwesomeError } from './AwesomeError';
import { AwesomeErrorPage } from './AwesomeErrorPage';


export default {
  component: AwesomeError,
  title: 'components/AwesomeError',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <AwesomeError />
  </Grommet>
);

export const asPage = () => (
  <Grommet theme={defaultTheme}>
    <AwesomeErrorPage />
  </Grommet>
);
