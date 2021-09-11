/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { NavigationLink } from './NavigationLink';

export default {
  component: NavigationLink,
  title: 'components/NavigationLink',
};

export const defaultStory = () => (
  <StorybookBaseProvider>
    <div
      style={{
        paddingLeft: '150px',
        background: '#ededed',
      }}
    >
      <NavigationLink title="Link" />
      <div
        style={{
          paddingBottom: '200px',
        }}
      />
      <NavigationLink
        title="Link With Dropdown"
        withDropMenu={{
          items: [
            {
              title: 'Nested 1',
            },
            {
              title: 'Nested 2',
            },
            {
              title: 'Longer Nested link than th ther text',
            },
          ],
        }}
      />
    </div>
  </StorybookBaseProvider>
);
