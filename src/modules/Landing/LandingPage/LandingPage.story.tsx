import React from 'react';
import StoryRouter from 'storybook-react-router';
import { SocketProvider } from 'src/components/SocketProvider';
import { LandingPage } from './LandingPage';
import { getPublicRooms } from './resources/index';

export default {
  component: LandingPage,
  title: 'Modules/Landing/Landing Page',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => (
  <SocketProvider>
    <LandingPage getRooms={getPublicRooms} />
  </SocketProvider>
);
