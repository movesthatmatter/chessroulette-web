import React from 'react';
import StoryRouter from 'storybook-react-router';
import { LandingPage } from './LandingPage';

export default {
  component: LandingPage,
  title: 'Modules/Landing/Landing Page',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => <LandingPage />;
