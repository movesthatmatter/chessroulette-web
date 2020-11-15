import React, { useRef, LegacyRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { ChessMove } from 'dstnd-io/dist/chessGame';
import { noop } from 'src/lib/util';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';
import { ChessGame, ChessGameColor } from '../Games/Chess';
import { getPlayerColor, getPlayer, getOppositePlayer } from './util';
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
import { CSSProperties } from 'src/lib/jss/types';
import { GameStateDialog } from './components/GameStateDialog';

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
  onOfferCanceled: () => void;
};

const TOP_HEIGHT = 80;
const BOTTOM_HEIGHT = 80;

export const GameRoomV2: React.FC<Props> = ({
  onMove = noop,
  onResign = noop,
  onAbort = noop,
  onOfferDraw = noop,
  onRematchOffer = noop,
  ...props
}) => {
  const cls = useStyles();
  const homeColor = getPlayerColor(props.room.me.id, props.room.activity.game.players);

  const { game } = props.room.activity;

  const myPlayer = getPlayer(props.room.me.user.id, game.players);
  const isMePlayer = !!myPlayer;
  const opponentPlayer = myPlayer
    ? getOppositePlayer(myPlayer, props.room.activity.game.players)
    : undefined;

  const canIPlay =
    isMePlayer && // I must be a player
    (game.state === 'pending' || game.state === 'started') && // game must be in playable mode
    game.lastMoveBy !== homeColor; // It must be my turn

  const dialogTarget = useRef();

  return (
    <>
      <div
        className={cls.container}
        style={{
          width: 'calc(100% - 32px)',
          paddingLeft: '32px',
        }}
      >
        <div className={cls.container} ref={dialogTarget as LegacyRef<any>}>
          <GameRoomLayout
            className={cls.layout}
            ratios={{
              leftSide: 1.2,
              gameArea: 3,
              rightSide: 2,
            }}
            minSpaceBetween={30}
            topHeight={TOP_HEIGHT}
            getTopComponent={({ right }) => (
              <Box fill direction="row" style={{ height: '100%' }}>
                <div
                  style={{
                    flex: 1,
                    // paddingLeft: '30px',
                    paddingTop: '16px',
                  }}
                >
                  <NavigationHeader />
                </div>
                <div
                  style={{
                    width: right.width,
                  }}
                />
              </Box>
            )}
            bottomHeight={BOTTOM_HEIGHT}
            getBottomComponent={({ right }) => (
              <Box
                fill
                align="center"
                direction="row"
                style={{
                  height: '100%',
                }}
              >
                <div style={{ width: right.width }} />
                <Box
                  align="center"
                  justify="center"
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      ...fonts.small2,
                      fontWeight: 200,
                    }}
                  >
                    Made with ❤️ across the world!
                  </Text>
                </Box>
                <div
                  style={{
                    width: right.width,
                    height: '100%',
                    background: colors.white,
                  }}
                />
              </Box>
            )}
            getLeftSideComponent={({ container }) => (
              <div
                className={cx(cls.side, cls.leftSide)}
                style={{
                  flex: 1,
                  height: container.height,
                }}
              >
                <div style={{ height: '30%' }} />
                <div style={{ height: '40%' }}>
                  <GameStateWidget game={props.room.activity.game} homeColor={homeColor} />
                </div>
                <div className={cls.gameActionsContainer} style={{ height: '30%' }}>
                  <div className={cls.gameActionButtonsContainer}>
                    {(game.state === 'finished' ||
                      game.state === 'stopped' ||
                      game.state === 'neverStarted') && (
                      <ActionButton
                        type="primary"
                        label="Rematch"
                        actionType="positive"
                        icon={Refresh}
                        reverse
                        onSubmit={() => onRematchOffer()}
                        className={cls.gameActionButton}
                      />
                    )}
                    {game.state === 'pending' && (
                      <ActionButton
                        type="primary"
                        label="Abort"
                        actionType="negative"
                        icon={Halt}
                        reverse
                        onSubmit={() => onAbort()}
                        className={cls.gameActionButton}
                      />
                    )}
                    {game.state === 'started' && (
                      <>
                        <ActionButton
                          type="primary"
                          label="Resign"
                          actionType="negative"
                          icon={Flag}
                          reverse
                          onSubmit={() => onResign(homeColor)}
                          className={cls.gameActionButton}
                        />
                        <ActionButton
                          type="primary"
                          label="Offer Draw"
                          actionType="positive"
                          icon={Split}
                          reverse
                          onSubmit={() => onOfferDraw()}
                          className={cls.gameActionButton}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            getGameComponent={({ container }) => (
              <div>
                <ChessGame
                  className={cls.board}
                  homeColor={homeColor}
                  playable={canIPlay}
                  pgn={props.room.activity.game.pgn || ''}
                  getBoardSize={() => container.width}
                  onMove={onMove}
                />
              </div>
            )}
            getRightSideComponent={({ container }) => (
              <div className={cx(cls.side, cls.rightSide)}>
                <div style={{
                  paddingTop: '16px',
                  height: `${TOP_HEIGHT - 16}px`,
                }}>
                  <UserMenu />
                </div>
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
                        // height: `${container.verticalPadding - 32}px`,
                        height: `${BOTTOM_HEIGHT + container.verticalPadding}px`,
                        // marginBottom: 0,
                        // marginBottom: '32px',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          />
          <GameStateDialog
            roomActivity={props.room.activity}
            onOfferCanceled={props.onOfferCanceled}
            onDrawAccepted={props.onDrawAccepted}
            onDrawDenied={props.onDrawDenied}
            onRematchAccepted={props.onRematchAccepted}
            onRematchDenied={props.onRematchDenied}
            myPlayer={myPlayer}
            target={dialogTarget.current}
          />
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    background: '#F6F8FB',
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
  leftSide: {},
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
    display: 'flex',
  },
  gameActionButtonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
  },
  gameActionButton: {
    ...({
      '&:last-of-type': {
        marginBottom: '0px !important',
      },
    } as CSSProperties),
  },
});
