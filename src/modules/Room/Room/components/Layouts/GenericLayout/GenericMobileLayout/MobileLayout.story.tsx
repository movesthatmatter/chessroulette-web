/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GenericMobileLayout } from './GenericMobileLayout';

export default {
  component: GenericMobileLayout,
  title: 'modules/Room/Layouts/GenericMobileLayout',
};

export const defaultStory = () => (
  <GenericMobileLayout
    getTopArea={() => (
      <div
        style={{
          background: 'purple',
        }}
      />
    )}
    getMainArea={() => (
      <div
        style={{
          background: 'blue',
        }}
      />
    )}
  />
);
