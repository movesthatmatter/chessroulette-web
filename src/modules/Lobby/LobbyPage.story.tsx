import React from 'react';
import StoryRouter from 'storybook-react-router';
import { SocketProvider } from 'src/components/SocketProvider';
import { getPublicRooms } from 'src/resources';
import { LobbyPage } from './LobbyPage';

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
