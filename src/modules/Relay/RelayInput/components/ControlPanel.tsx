import { ChessGameColor, ChessGameStateFinished, ChessMove, GameRecord, Resources } from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import React, { useRef, useState } from 'react';
import { Button, IconButton } from 'src/components/Button';
import { ConfirmButton } from 'src/components/Button/ConfirmButton';
import { Dialog, DialogContent } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { ChessGame } from 'src/modules/Games/Chess';
import { gameRecordToGame, getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { CustomTheme, effects, onlyMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';
import { delay } from 'src/lib/time';
import { HTMLDivElement } from 'window-or-global';

type Props = {
  relay: Resources.AllRecords.Relay.RelayedGameRecord | undefined;
  containerWidth: number;
  onAddMove: (m: ChessMove) => void;
  onSubmit: () => void;
  onUndo: () => void;
  submitDisabled: boolean;
  onSetWinner: (w: ChessGameStateFinished['winner']) => void;
};

export const ControlPanel: React.FC<Props> = ({
  relay,
  containerWidth,
  onAddMove,
  onSubmit,
  onUndo,
  submitDisabled,
  onSetWinner,
}) => {
  const cls = useStyles();

  const [orientation, setOrientation] = useState<ChessGameColor>('white');
  const [showEndPopup, setShowEndPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function closeEndGamePopup() {
    await delay(200);
    setShowEndPopup(false);
  }

  return (
    <div className={cls.container}>
      <div style={{ display: 'flex' }} ref={containerRef}>
        <div style={{ minWidth: containerWidth, minHeight: containerWidth }}>
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
          <Button
            label="Submit Move"
            onClick={onSubmit}
            disabled={submitDisabled}
            type="positive"
          />
          <br />
          <ConfirmButton
            buttonProps={{
              label: 'Undo Move',
              type: 'negative',
              full: true,
            }}
            dialogProps={{
              title: 'Undo last move?',
              content: 'Are you sure you want to undo the last move?',
              buttonsStacked: false,
            }}
            cancelButtonProps={{
              type: 'secondary',
            }}
            confirmButtonProps={{
              type: 'negative',
              label: 'Yes',
            }}
            onConfirmed={onUndo}
          />
          <br />
          <Button
            label="End Game"
            onClick={() => setShowEndPopup(true)}
            type="secondary"
            disabled={!relay?.game || relay.game.state !== 'started'}
          />
        </div>
      </div>
      <Dialog
        visible={showEndPopup}
        hasCloseButton
        onClose={() => setShowEndPopup(false)}
        content={
          <div>
            <Text size="subtitle1">Select winner :</Text>
            <div style={{ display: 'flex', width: '100%', marginTop: spacers.default }}>
              <div style={{ display: 'flex', flex: 0.33, justifyContent: 'center' }}>
                <Text size="body2">White</Text>
              </div>
              <div style={{ display: 'flex', flex: 0.33, justifyContent: 'center' }}>
                <Text size="body2">Draw</Text>
              </div>
              <div style={{ display: 'flex', flex: 0.33, justifyContent: 'center' }}>
                <Text size="body2">Black</Text>
              </div>
            </div>
            <div style={{ display: 'flex', width: '100%', marginTop: spacers.small }}>
              <div
                style={{
                  flex: 0.33,
                  display: 'flex',
                  justifyContent: 'center',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
                onClick={() => {
                  onSetWinner('white');
                  closeEndGamePopup();
                }}
                className={cls.winnerButton}
              >
                <FontAwesomeIcon icon={faChessKnight} color="white" size="lg" />
              </div>
              <div
                style={{ flex: 0.33, display: 'flex', justifyContent: 'center' }}
                className={cls.winnerButton}
                onClick={() => {
                  onSetWinner('1/2');
                  closeEndGamePopup();
                }}
              >
                <Text size="subtitle1">1/2</Text>
              </div>
              <div
                style={{
                  flex: 0.33,
                  display: 'flex',
                  justifyContent: 'center',
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
                onClick={() => {
                  onSetWinner('black');
                  closeEndGamePopup();
                }}
                className={cls.winnerButton}
              >
                <FontAwesomeIcon icon={faChessKnight} color="black" size="lg" />
              </div>
            </div>
          </div>
        }
      />
      {relay && relay.game.winner && (
        <div className={cls.winnerContainer}>
          <div className={cls.dialog}>
            <DialogContent
              title="Game Ended"
              hasCloseButton={false}
              content={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Text>
                    {relay.game.winner === '1/2'
                      ? 'Game ended in a draw.'
                      : `${getPlayerByColor(relay.game.winner, relay.game.players).user.name} won!`}
                  </Text>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    position: 'relative',
  },
  button: {
    background: theme.colors.primaryLight,
    marginBottom: 0,
  },
  winnerButton: {
    padding: '5px',
    backgroundColor: theme.colors.neutralLight,
    '&:hover': {
      backgroundColor: theme.colors.neutralDark,
      cursor: 'pointer',
    },
  },
  winnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // background: `rgba(0, 0, 0, .3)`,
    zIndex: 9,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    ...effects.floatingShadowDarkMode,
    ...softBorderRadius,
    padding: 0,
    position: 'relative',
    background: theme.colors.white,

    ...makeImportant({
      borderRadius: '8px',
      minWidth: '240px',
      maxWidth: '360px',
      width: '60%',
    }),
    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
      }),
    }),
  },
}));
