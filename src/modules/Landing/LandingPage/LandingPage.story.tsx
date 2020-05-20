import React from 'react';
import StoryRouter from 'storybook-react-router';
import { SocketProvider } from 'src/components/SocketProvider';
import { LandingPage } from './LandingPage';

export default {
  component: LandingPage,
  title: 'Modules/Landing/Landing Page',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => (
  <SocketProvider>
    <LandingPage />
  </SocketProvider>
);
