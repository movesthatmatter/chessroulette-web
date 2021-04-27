import { Box, Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { AwesomeLoader } from './AwesomeLoader';
import { AwesomeLoaderPage } from './AwesomeLoaderPage';

export default {
  component: AwesomeLoaderPage,
  title: 'Components/AwesomeLoader',
};

export const defaultStory = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <Grommet theme={defaultTheme}>
      <AwesomeLoader />
    </Grommet>
  </div>
);

export const asPage = () => (
  <Grommet theme={defaultTheme}>
    <AwesomeLoaderPage />
  </Grommet>
);

export const minimal = () => (
  <div
    style={{
      width: '100px',
    }}
  >
    <Grommet theme={defaultTheme}>
      <AwesomeLoader minimal />
    </Grommet>
  </div>
);

export const gamePendingSayings = () => (
  <div style={{ width: '300px' }}>
    <Grommet theme={defaultTheme}>
      <AwesomeLoader
        sayings={[
          'Loading...',
          'Your opponent is just getting ready',
          `Let's hope your friend is not scared of a challenge`,
          'Establishing connection...',
          `Patience is a virtue.. I guess`,
          `Get ready, your friend is on the way.`,
          `Still time to polish your chess`,
        ]}
      />
    </Grommet>
  </div>
);
