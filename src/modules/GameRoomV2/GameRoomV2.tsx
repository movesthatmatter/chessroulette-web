import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { Room } from 'src/components/RoomProvider';
import { StandaloneChessGame } from 'src/modules/Games/Chess/components/StandaloneChessGame';
import { Box } from 'grommet';
import { PopupContent } from 'src/components/PopupContent';
import { Modal } from 'src/components/Modal/Modal';
import { ChessMove } from 'dstnd-io/dist/chessGame';
import { noop } from 'src/lib/util';
import { Button } from 'src/components/Button';
import { ConfirmationButton } from 'src/components/ConfirmationButton';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';
import { ChessGameColor } from '../Games/Chess';
import { getOpponent, isPlayer, getPlayerColor } from './util';

type Props = {
  room: Room;
  onMove?: (m: ChessMove) => void;
  onResign?: (resigningColor: ChessGameColor) => void;
  onAbort?: () => void;
  onOfferDraw?: () => void;
};

export const GameRoomV2: React.FC<Props> = ({
  onMove = noop,
  onResign = noop,
  onAbort = noop,
  onOfferDraw = noop,
  ...props
}) => {
  const cls = useStyles();
  const [showGameFinishedPopup, setShowGameFinishedPopup] = useState(false);

  const homeColor = getPlayerColor(props.room.me.id, props.room.game.players);

  const opponentPlayer = getOpponent(props.room.me.id, props.room.game.players);

  const { game } = props.room;

  useEffect(() => {
    if (props.room.game.state === 'finished') {
      setShowGameFinishedPopup(true);
    }
  }, [props.room.game]);

  return (
    <div className={cls.container}>
      <GameRoomLayout
        getGameComponent={(dimensions) => (
          <StandaloneChessGame
            homeColor={homeColor}
            playable={
              (game.state === 'pending' || game.state === 'started')
              && isPlayer(props.room.me.id, game.players)
              && game.lastMoveBy !== homeColor
            }
            game={props.room.game}
            getBoardSize={() => dimensions.width}
            onMove={(nextMove) => {
              // don't move unless the game is pending or started
              if (
                !game
                || game.state === 'finished'
                || game.state === 'neverStarted'
              ) {
                return;
              }

              // props.onGameStateUpdate(chessGameActions.move(props.game, { pgn: nextPgn }));
              onMove(nextMove);
            }}
            // onTimerFinished={() => {
            //   if (
            //     !props.game
            //     || props.game.state === 'finished'
            //     || props.game.state === 'neverStarted'
            //   ) {
            //     return;
            //   }

            //   props.onGameStateUpdate(chessGameActions.timerFinished(props.game));
            // }}
          />
        )}
        getSideComponent={(dimensions) => (
          <div className={cls.side}>
            <StreamingBox
              room={props.room}
              opponentPeerId={opponentPlayer?.user.id}
              // peer={opponent}
              width={dimensions.width}
            />
            <div className={cls.sideBottom}>
              {(game.state === 'started') && (
                <>
                  <ConfirmationButton
                    label="Resign"
                    onSubmit={() => onResign(homeColor)}
                    confirmationPopupContent={(
                      <>Are you sure you want to resign?</>
                    )}
                  />
                  <ConfirmationButton
                    label="Offer Draw"
                    onSubmit={onOfferDraw}
                    confirmationPopupContent={(
                      <>Are you sure you want to offer draw?</>
                    )}
                  />
                </>
              )}
              {game.state === 'pending' && (
                <ConfirmationButton
                  label="Abort"
                  onSubmit={onAbort}
                  confirmationPopupContent={(
                    <>Are you sure you want to abort?</>
                  )}
                />
              )}

              {/* {!props.game ? (
                <div className={cls.playButtonsContainer}>
                  <PlayButtonWidget type="challenge" />
                  <PlayButtonWidget type="friendly" />
                </div>
              ) : (
                <ChatContainer className={cls.chatContainer} />
              )} */}
            </div>
          </div>
        )}
      />
      <Modal
        visible={showGameFinishedPopup}
        onEsc={() => setShowGameFinishedPopup(false)}
        onClickOutside={() => setShowGameFinishedPopup(false)}
      >
        <PopupContent
          hasCloseButton
          onClose={() => setShowGameFinishedPopup(false)}
        >
          <Box>
            {`${game?.winner} won`}
          </Box>
        </PopupContent>
      </Modal>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
  },
  playButtonsContainer: {
    padding: '1em 0',
  },
  side: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  sideBottom: {
    flex: 1,
  },
  chatContainer: {
    height: '100%',
    background: 'white',
  },
});
