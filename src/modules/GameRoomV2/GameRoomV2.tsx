import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { Box, Text } from 'grommet';
import { Modal } from 'src/components/Modal/Modal';
import { ChessMove } from 'dstnd-io/dist/chessGame';
import { noop } from 'src/lib/util';
import { Button } from 'src/components/Button';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';
import { ChessGame, ChessGameColor } from '../Games/Chess';
import { getOpponent, isPlayer, getPlayerColor } from './util';
import { otherChessColor } from '../Games/Chess/util';
import { floatingShadow, softBorderRadius } from 'src/theme/effects';
import cx from 'classnames';
import { GameStateWidget } from '../Games/Chess/components/GameStateWidget/GameStateWidget';
import { ActionButton } from 'src/components/Button';
import { Refresh, Halt, Flag, Split } from 'grommet-icons';
import { colors, fonts } from 'src/theme';
import { ChatContainer } from 'src/components/Chat';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigationHeader, UserMenu } from 'src/components/Navigation';

type Props = {
  room: RoomWithPlayActivity;
  onMove: (m: ChessMove) => void;
  onResign: (resigningColor: ChessGameColor) => void;
  onAbort: () => void;
  onOfferDraw: () => void;
  onDrawAccepted: () => void;
  onDrawDenied: () => void;
  onRematchOffer: () => void;
  onRematchAccepted: () => void;
  onRematchDenied: () => void;
};

export const GameRoomV2: React.FC<Props> = ({
  onMove = noop,
  onResign = noop,
  onAbort = noop,
  onOfferDraw = noop,
  onRematchOffer = noop,
  ...props
}) => {
  const cls = useStyles();
  const [showGameFinishedPopup, setShowGameFinishedPopup] = useState(false);

  const homeColor = getPlayerColor(props.room.me.id, props.room.activity.game.players);
  const opponentPlayer = getOpponent(props.room.me.id, props.room.activity.game.players);

  const { game, offer } = props.room.activity;

  const isMePlayer = isPlayer(props.room.me.user.id, game.players);
  const myPlayerColor = getPlayerColor(props.room.me.user.id, game.players);

  const canIPlay =
    (game.state === 'pending' || game.state === 'started') && // game must should be in payable mode
    isMePlayer && // I must be a player
    game.lastMoveBy !== homeColor; // It must be my turn

  useEffect(() => {
    if (props.room.activity.game.state === 'finished') {
      setShowGameFinishedPopup(true);
    }
  }, [props.room.activity.game]);

  return (
    <div className={cls.container}>
      <GameRoomLayout
        className={cls.layout}
        ratios={{
          leftSide: 1.2,
          gameArea: 3,
          rightSide: 2,
        }}
        minSpaceBetween={30}
        topHeight={80}
        getTopComponent={(dimensions) => (
          <Box
            fill
            direction="row"
            style={{
              height: '100%',
            }}
          >
            <div
              style={{
                flex: 1,
                paddingLeft: '30px',
                paddingTop: '16px',
              }}
            >
              <NavigationHeader />
            </div>
            <div
              style={{
                width: dimensions.rightSideWidth,
                background: colors.white,
                height: '100%',
                display: 'flex',
                alignSelf: 'flex-end',
                justifySelf: 'flex-end',
              }}
            >
              <div
                style={{
                  paddingTop: '16px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                }}
              >
                <UserMenu />
              </div>
            </div>
          </Box>
        )}
        bottomHeight={30}
        getBottomComponent={(dimensions) => (
          <Box fill align="center" direction="row">
            <div style={{ width: dimensions.rightSideWidth }} />
            <Box
              align="center"
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  ...fonts.small2,
                  paddingBottom: '20px',
                  fontWeight: 200,
                  // background: 'green',
                }}
              >
                Made with ❤️ across the world!
              </Text>
            </Box>
            <div
              style={{
                width: dimensions.rightSideWidth,
                height: '100%',
                background: colors.white,
              }}
            />
          </Box>
        )}
        getLeftSideComponent={(dimensions) => (
          <div
            style={{
              height: '100%',
            }}
          >
            <div
              className={cx(cls.side, cls.leftSide)}
              style={{
                flex: 1,
                height: dimensions.height,
              }}
            >
              <div
                style={{
                  flex: 1,
                }}
              />
              <div style={{ flex: 1.2 }}>
                <GameStateWidget game={props.room.activity.game} homeColor={homeColor} />
              </div>
              <div className={cls.gameActionsContainer}>
                <div className={cls.gameActionButtonsContainer}>
                  {(game.state === 'finished' ||
                    game.state === 'stopped' ||
                    game.state === 'neverStarted') && (
                    <div className={cls.gameActionButtonWrapper}>
                      <ActionButton
                        type="primary"
                        label="Rematch"
                        actionType="positive"
                        icon={Refresh}
                        reverse
                        onSubmit={() => onRematchOffer()}
                      />
                    </div>
                  )}
                  {game.state === 'pending' && (
                    <div className={cls.gameActionButtonWrapper}>
                      <ActionButton
                        type="primary"
                        label="Abort"
                        actionType="negative"
                        icon={Halt}
                        reverse
                        onSubmit={() => onAbort()}
                      />
                    </div>
                  )}
                  {game.state === 'started' && (
                    <>
                      <div className={cls.gameActionButtonWrapper}>
                        <ActionButton
                          type="primary"
                          label="Resign"
                          actionType="negative"
                          icon={Flag}
                          reverse
                          onSubmit={() => onResign(homeColor)}
                        />
                      </div>
                      <div className={cls.gameActionButtonWrapper}>
                        <ActionButton
                          type="primary"
                          label="Offer Draw"
                          actionType="positive"
                          icon={Split}
                          reverse
                          onSubmit={() => onOfferDraw()}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        getGameComponent={(dimensions) => (
          <div>
            <ChessGame
              className={cls.board}
              homeColor={homeColor}
              playable={canIPlay}
              pgn={props.room.activity.game.pgn || ''}
              getBoardSize={() => dimensions.width}
              onMove={onMove}
            />
          </div>
        )}
        getRightSideComponent={(dimensions) => (
          <div className={cx(cls.side, cls.rightSide)}>
            <div
              className={cls.sideContent}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden',
                alignItems: 'stretch',
                height: '100%',
              }}
            >
              <div>
                <StreamingBox
                  room={props.room}
                  focusedPeerId={isMePlayer ? opponentPlayer?.user.id : undefined}
                />
              </div>
              <div
                style={{
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid',
                  borderColor: colors.neutral,
                }}
              >
                <Text
                  style={{
                    ...fonts.subtitle2,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faComment}
                    size="lg"
                    color={colors.neutral}
                    style={{
                      marginRight: '8px',
                    }}
                  />
                  Messages
                </Text>
              </div>
              <div
                style={{
                  borderColor: colors.neutral,
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                <ChatContainer
                  inputContainerStyle={{
                    height: `${dimensions.verticalPadding - 32}px`,
                    marginBottom: '32px',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      />
      <Modal
        visible={
          isMePlayer &&
          offer?.type === 'draw' &&
          offer?.content.by === otherChessColor(myPlayerColor)
        }
      >
        <Box pad="medium" gap="small" width="medium">
          Your opponent is offering a Draw!
          <Button onClick={() => props.onDrawAccepted()} label="Accept" />
          <Button onClick={() => props.onDrawDenied()} label="Deny" />
        </Box>
      </Modal>
      <Modal
        visible={
          isMePlayer &&
          offer?.type === 'rematch' &&
          offer?.content.by === otherChessColor(myPlayerColor)
        }
      >
        <Box pad="medium" gap="small" width="medium">
          Your opponent wants a Rematch!
          <Button onClick={() => props.onRematchAccepted()} label="Accept" />
          <Button onClick={() => props.onRematchDenied()} label="Deny" />
        </Box>
      </Modal>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
  },
  layout: {},
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  playButtonsContainer: {
    padding: '1em 0',
  },
  side: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  sideContent: {},
  leftSide: {
    justifyContent: 'center',
  },
  rightSide: {
    background: colors.white,
    paddingLeft: '30px',
    paddingRight: '30px',
  },
  sideBottom: {
    flex: 1,
  },
  chatContainer: {
    height: '100%',
    background: 'white',
  },
  gameActionsContainer: {
    flex: 1,
    display: 'flex',
  },
  gameActionButtonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
  },
  gameActionButtonWrapper: {
    marginTop: '8px',
  },
});
