import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ApiProvider } from 'src/components/Api/ApiProvider';
import { LobbyPage } from './LobbyPage';
import { getPublicRooms } from './resources';

export default {
  component: LobbyPage,
  title: 'Modules/Lobby/LobbyPage',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => (
  <ApiProvider>
    <LobbyPage getRooms={getPublicRooms} />
  </ApiProvider>
);
