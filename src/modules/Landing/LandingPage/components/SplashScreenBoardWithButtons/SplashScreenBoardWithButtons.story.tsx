import React from 'react';
import StoryRouter from 'storybook-react-router';
import { SplashScreenBoardWithButtons } from './SplashScreenBoardWithButtons';

export default {
  component: SplashScreenBoardWithButtons,
  title: 'Modules/Landing/SplashScreen Board With Buttons',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => (
  <div style={{ marginLeft: '100px' }}>
    <SplashScreenBoardWithButtons />
  </div>
);
