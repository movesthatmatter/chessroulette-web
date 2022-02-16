import React, {useState} from 'react';
import {WarGameBoard} from 'wargame-board';
import {WarGameMocker} from 'src/mocks/records/WarGameMocker';
import { WarGame } from 'src/modules/Games';
import { ChessGameColor, warGameActions } from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { Button } from 'src/components/Button';
import { console } from 'window-or-global';

export default {
  component: WarGameBoard,
  title: 'modules/Games/WarGame/WarGameBoard'
}

const wargameMocker = new WarGameMocker();

export const withSwitches = () =>
React.createElement(() => {
  const [game, setGame] = useState<WarGame>(wargameMocker.pending());
  const [turn, setTurn] = useState<ChessGameColor>('white');
  const [playable, setPlayable] = useState(true);
  const [canInteract, setCanInteract] = useState(true)

  return (
    <div style={{display:'flex', gap:'20px'}}>
    <WarGameBoard
      key={game.id}
      game={game}
      size={400}
      orientation={'white'}
      turnColor={turn}
      playableColor={turn}
      playable={playable}
      canInteract={canInteract}
      onMove={(move, type) => {
        console.log('prev state', game);
        if (game.state === 'pending' || game.state === 'started') {
          const newGameState = warGameActions.move(game, { move: {move, type}, moveAt: toISODateTime(new Date()) });
          console.log('new game state', newGameState);
          setGame((prev) => ({
            ...prev,
            ...newGameState
          }));
          setTurn((prev) => (prev === 'white' ? 'black' : 'white'));

          action('on move')(move);
        }
      }}
    />
    <div style={{display:'flex', flexDirection:'column', gap: '10px'}}>
      <Button 
        label={playable? 'Playable' : 'Not Playable'}
        onClick={() => setPlayable(prev => !prev)}
      />
      <Button 
        label={canInteract? 'Can Interact' : 'No Interact'}
        onClick={() => setCanInteract(prev => !prev)}
      />
      <Button 
        label={turn === 'white' ? 'Turn: White' : 'Turn: Black'}
        onClick={() => setTurn(prev => prev === 'white' ? 'black' : 'white')}
      />
    </div>
    </div>
  );
});