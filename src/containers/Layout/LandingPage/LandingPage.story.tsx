import React from 'react';
import LandingPage from './LandingPage';
import StoryRouter from 'storybook-react-router';

export default {
    component : LandingPage,
    title : 'UI Components/Landing Page/Landing Page ',
    decorators : [StoryRouter()]
}


export const defaultLandingPage = () => <LandingPage/>