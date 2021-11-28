import {
  ChessGameColor,
  ChessMove,
  Resources,
} from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import React, { useState } from 'react';
import { Button, IconButton } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { ChessGame } from 'src/modules/Games/Chess';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { CustomTheme } from 'src/theme';
import { spacers } from 'src/theme/spacers';

type Props = {
  relay: Resources.AllRecords.Relay.RelayedGameRecord | undefined;
  containerWidth: number;
  onAddMove: (m: ChessMove) => void;
  onSubmit: () => void;
  onUndo: () => void;
  submitDisabled: boolean;
};

export const ControlPanel: React.FC<Props> = ({
  relay,
  containerWidth,
  onAddMove,
  onSubmit,
  onUndo,
  submitDisabled,
}) => {
  const cls = useStyles();

  const [orientation, setOrientation] = useState<ChessGameColor>('white');

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{minWidth: containerWidth, minHeight: containerWidth}}>
        {relay?.game && (
          <ChessGame
            size={containerWidth}
            game={gameRecordToGame(relay.game)}
            onAddMove={({ move }) => {
              onAddMove(move);
            }}
            canInteract
            playable
            playableColor={otherChessColor(relay.game.lastMoveBy || 'black')}
            turnColor={otherChessColor(relay.game.lastMoveBy || 'black')}
            orientation={orientation}
          />
        )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginLeft: spacers.default,
          }}
        >
          {/* TODO -- Add later the flip button, no time now to sync with countdowns as well */}
          {/* {relay?.game && (
            <IconButton
              type="primary"
              size="default"
              title="Flip Board"
              iconPrimaryColor={colors.universal.white}
              className={cls.button}
              iconType="iconly"
              icon={Swap}
              onSubmit={() => setOrientation((prev) => (prev === 'white' ? 'black' : 'white'))}
            />
          )} */}
          <br />
          <Button label="Submit Move" onClick={onSubmit} disabled={submitDisabled} type='primary'/>
          <br />
          <Button label='Undo' onClick={onUndo} type='negative'/>
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {},
  button: {
    background: theme.colors.primaryLight,
    marginBottom: 0,
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
