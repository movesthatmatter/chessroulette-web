import React, { useState } from 'react';
import { WarGameMocker } from 'src/mocks/records/WarGameMocker';
import { WarGame } from 'src/modules/Games';
import { ChessGameColor, warGameActions } from 'chessroulette-io';
import { action } from '@storybook/addon-actions';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { Button } from 'src/components/Button';
import { console } from 'window-or-global';
import { WarGameActivity } from './WarGameActivity';

export default {
  component: WarGameActivity,
  title: 'modules/Games/WarGame/WarGameBoard',
};

const wargameMocker = new WarGameMocker();

export const withSwitches = () =>
  React.createElement(() => {
    const [game, setGame] = useState<WarGame>(wargameMocker.pending());
    const [turn, setTurn] = useState<ChessGameColor>('white');
    const [playable, setPlayable] = useState(true);
    const [canInteract, setCanInteract] = useState(true);

    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            label={playable ? 'Playable' : 'Not Playable'}
            onClick={() => setPlayable((prev) => !prev)}
          />
          <Button
            label={canInteract ? 'Can Interact' : 'No Interact'}
            onClick={() => setCanInteract((prev) => !prev)}
          />
          <Button
            label={turn === 'white' ? 'Turn: White' : 'Turn: Black'}
            onClick={() => setTurn((prev) => (prev === 'white' ? 'black' : 'white'))}
          />
        </div>
      </div>
    );
  });
