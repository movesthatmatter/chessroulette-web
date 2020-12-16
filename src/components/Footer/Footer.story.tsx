import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { Footer } from './Footer';


export default {
  component: Footer,
  title: 'components/Footer',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <Footer />
  </Grommet>
)