import React from 'react';
import { GameOverPopup } from './GameOverPopup';

export default {
  component: GameOverPopup,
  title: 'Components/Popups/Game Over',
};

export const gameOver = () => React.createElement(
  () => (
    <div style={{ display: 'flex', width: '400px' }}>
      <GameOverPopup
        onRematch={() => console.log('rematch')}
        winner="Gandalf"
        onClose={() => console.log('close')}
      />
    </div>
  ),
);
