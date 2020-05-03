import React from 'react';
import './GamePage.css';
import { NavLink } from 'react-router-dom';
import { GameRoomContainer } from 'src/modules/GameRoom/GameRoomContainer';

export const GamePage: React.FC = () => (
  <div className="container">
    {/* <div>Game Page</div> */}

    {/* <NavLink to="/">Go Back</NavLink> */}
    <GameRoomContainer />
  </div>
);
