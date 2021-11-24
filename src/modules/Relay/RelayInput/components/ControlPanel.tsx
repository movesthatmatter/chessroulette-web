import { ChessMove, Resources } from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import React from 'react';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { ChessGame } from 'src/modules/Games/Chess';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';

type Props = {
  relay: Resources.AllRecords.Relay.RelayedGameRecord | undefined;
  containerWidth: number;
  onAddMove: (m:ChessMove) => void;
  onAddRelay: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
};

export const ControlPanel: React.FC<Props> = ({relay, containerWidth, onAddMove, onAddRelay,  onSubmit,  submitDisabled}) => {
  const cls = useStyles();

  return (
    <div style={{}}>
          {relay?.game && (
            <ChessGame
              size={containerWidth}
              game={gameRecordToGame(relay.game)}
              onAddMove={({move}) => {
                onAddMove(move);
              }}
              canInteract
              playable
              playableColor={otherChessColor(relay.game.lastMoveBy || 'black')}
              turnColor={'white'}
              orientation='white'
            />
          )}

          <Button label="Submit" onClick={onSubmit} disabled={submitDisabled} />
          <Button
            label="Create Relay"
            onClick={onAddRelay}
          />
        </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});