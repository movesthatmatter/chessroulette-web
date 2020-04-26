import React from 'react';
import './GamePage.css';
import {NavLink} from 'react-router-dom';

export const GamePage : React.FC = () => {
    return (
        <div className="container">
            <div>Game Page</div>
            <NavLink to="/">Go Back</NavLink>
        </div>
    )
}