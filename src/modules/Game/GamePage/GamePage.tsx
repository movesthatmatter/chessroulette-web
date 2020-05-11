import React from 'react';
import './GamePage.css';
import { LobbyPage } from 'src/modules/Lobby/LobbyPage';
import { getPublicRooms } from 'src/modules/Lobby/resources';
import { NavLink } from 'react-router-dom';

export const GamePage: React.FC = () => (
  <LobbyPage getRooms={getPublicRooms} />
);
