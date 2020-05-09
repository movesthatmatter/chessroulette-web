import React from 'react';
import StoryRouter from 'storybook-react-router';
import { SocketProvider } from 'src/components/SocketProvider';
import { LobbyPage } from './LobbyPage';
import { getPublicRooms } from './resources';

export default {
  component: LobbyPage,
  title: 'Modules/Lobby/LobbyPage',
  decorators: [StoryRouter()],
};

export const defaultLandingPage = () => (
  <SocketProvider>
    <LobbyPage getRooms={getPublicRooms} />
  </SocketProvider>
);
