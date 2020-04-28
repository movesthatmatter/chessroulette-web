import React from 'react';
import StoryRouter from 'storybook-react-router';
import { LandingPage } from './LandingPage';

export default {
  component: LandingPage,
  title: 'UI Components/Landing Page/Landing Page ',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => <LandingPage />;
