import React, { useRef, LegacyRef, useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { ChessGameStatePgn, ChessMove } from 'dstnd-io/dist/chessGame';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';
import { ChessGame, ChessGameColor, useSoundEffects } from '../Games/Chess';
import { getPlayerColor, getPlayer, getOppositePlayer } from './util';
import { floatingShadow, softBorderRadius } from 'src/theme/effects';
import cx from 'classnames';
import { GameStateWidget } from '../Games/Chess/components/GameStateWidget/GameStateWidget';
import { ActionButton } from 'src/components/Button';
import { Refresh, Halt, Flag, Split } from 'grommet-icons';
import { colors, fonts, MOBILE_BREAKPOINT } from 'src/theme';
import { ChatContainer } from 'src/components/Chat';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigationHeader, UserMenu } from 'src/components/Navigation';
import { CSSProperties } from 'src/lib/jss/types';
import { GameStateDialog } from './components/GameStateDialog';
import { Move } from 'chess.js';
import { Events } from 'src/services/Analytics';
import { useWindowWidth } from '@react-hook/window-size';
import { PlayerBox } from '../Games/Chess/components/GameStateWidget/components/PlayerBox';
import { MobileGameRoomLayout } from './GameRoomLayout/MobileGameRoomLayout';
import { otherChessColor } from '../Games/Chess/util';
import { getRelativeMaterialScore } from '../Games/Chess/components/GameStateWidget/util';

type Props = {
  room: RoomWithPlayActivity;
  onMove: (m: ChessMove, pgn: ChessGameStatePgn, history: Move[], color: ChessGameColor) => void;
  onResign: (resigningColor: ChessGameColor) => void;
  onAbort: () => void;
  onOfferDraw: () => void;
  onDrawAccepted: () => void;
  onDrawDenied: () => void;
  onRematchOffer: () => void;
  onRematchAccepted: () => void;
  onRematchDenied: () => void;
  onOfferCanceled: () => void;
  onTimerFinished: () => void;
  onStatusCheck: () => void;
};

const TOP_HEIGHT = 80;
const BOTTOM_HEIGHT = 80;

export const GameRoomV2: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dialogTarget = useRef();
  const windowWidth = useWindowWidth();

  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);

  useSoundEffects(props.room.activity.game);

  // Analytics
  useEffect(() => {
    Events.trackPageView('Game Room');
  }, []);

  useEffect(() => {
    props.onStatusCheck();
  }, []);

  const homeColor = getPlayerColor(props.room.me.id, props.room.activity.game.players);

  const { game } = props.room.activity;

  const myPlayer = getPlayer(props.room.me.user.id, game.players);
  const isMePlayer = !!myPlayer;
  const opponentPlayer = myPlayer
    ? getOppositePlayer(myPlayer, props.room.activity.game.players)
    : undefined;
  
  const now = new Date();
  const myTimeLeft =
    game.state === 'started' && game.lastMoveBy !== homeColor
      ? game.timeLeft[homeColor] - (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[homeColor];
  const opponentTimeLeft =
    game.state === 'started' && game.lastMoveBy === homeColor
      ? game.timeLeft[otherChessColor(homeColor)] -
        (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[otherChessColor(homeColor)];
  
    const materialScore = getRelativeMaterialScore(game.captured);

  const canIPlay =
    isMePlayer && // I must be a player
    (game.state === 'pending' || game.state === 'started') && // game must be in playable mode
    game.lastMoveBy !== homeColor && // It must be my turn
    gameDisplayedHistoryIndex === 0; // The most recent move must be displayed

  useEffect(() => {
    // Reset the History Dislayed Index when the PGN is updated
    setGameDisplayedHistoryIndex(0);
  }, [game.pgn]);

  // If Mobile
  if (windowWidth <= MOBILE_BREAKPOINT) {
    return (
      <MobileGameRoomLayout
        getTopArea={(dimensions) => (
          <div style={{
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left:0 ,
              right: 0,
              zIndex: 999,
            }}>
              <NavigationHeader/>
            </div>
            <StreamingBox
              room={props.room}
              focusedPeerId={isMePlayer ? opponentPlayer?.user.id : undefined}
              aspectRatio={dimensions}
            />
          </div>
        )}
        getMainArea={(dimensions) => (
          <>
            {opponentPlayer && (
              <div className={cls.mobileAwayPlayerWrapper}>
                <PlayerBox
                  player={opponentPlayer}
                  timeLeft={opponentTimeLeft}
                  active={game.state === 'started' && game.lastMoved !== opponentPlayer.color}
                  gameTimeLimit={game.timeLimit}
                  material={materialScore[opponentPlayer.color]}
                  onTimerFinished={props.onTimerFinished}
                />
              </div>
            )}
            <div style={{ padding: '2px 8px 4px' }}>
              <ChessGame
                className={cls.mobileBoard}
                homeColor={homeColor}
                playable={canIPlay}
                pgn={props.room.activity.game.pgn || ''}
                getBoardSize={() => dimensions.width - 16}
                onMove={(...args) => {
                  props.onMove(...args, homeColor);
                }}
                onRewind={() => {
                  setGameDisplayedHistoryIndex((prev) => prev + 1);
                }}
                onForward={() => {
                  setGameDisplayedHistoryIndex((prev) => prev - 1);
                }}
                displayedHistoryIndex={gameDisplayedHistoryIndex}
              />
            </div>
            {myPlayer && (
              <div className={cls.mobileHomePlayerWrapper}>
                <PlayerBox
                  player={myPlayer}
                  timeLeft={myTimeLeft}
                  active={game.state === 'started' && game.lastMoved !== myPlayer.color}
                  gameTimeLimit={game.timeLimit}
                  material={materialScore[myPlayer.color]}
                  onTimerFinished={props.onTimerFinished}
                />
              </div>
            )}
          </>
        )}
      />
    );
  }

  return (
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
                paddingLeft: '16px',
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
                Made with ❤️ around the world!
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
        getLeftSideComponent={({ container, main }) => (
          <div
            className={cx(cls.side, cls.leftSide)}
            style={{
              flex: 1,
              height: container.height,
              paddingLeft: `${main.horizontalPadding < 32 ? 32 - main.horizontalPadding : 0}px`,
            }}
          >
            <div style={{ height: '30%' }} />
            <div style={{ height: '40%' }}>
              <GameStateWidget
                game={props.room.activity.game}
                homeColor={homeColor}
                historyFocusedIndex={gameDisplayedHistoryIndex}
                onMoveClick={setGameDisplayedHistoryIndex}
                onTimerFinished={props.onTimerFinished}
              />
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
                    onSubmit={() => props.onRematchOffer()}
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
                    onSubmit={() => props.onAbort()}
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
                      onSubmit={() => props.onResign(homeColor)}
                      className={cls.gameActionButton}
                    />
                    <ActionButton
                      type="primary"
                      label="Offer Draw"
                      actionType="positive"
                      icon={Split}
                      reverse
                      onSubmit={() => props.onOfferDraw()}
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
              onMove={(...args) => {
                props.onMove(...args, homeColor);
              }}
              onRewind={() => {
                setGameDisplayedHistoryIndex((prev) => prev + 1);
              }}
              onForward={() => {
                setGameDisplayedHistoryIndex((prev) => prev - 1);
              }}
              displayedHistoryIndex={gameDisplayedHistoryIndex}
            />
          </div>
        )}
        getRightSideComponent={({ container, isMobile }) => (
          <div className={cx(cls.side, cls.rightSide)}>
            <div
              style={{
                // paddingTop: '16px',
                height: `${TOP_HEIGHT}px`,
              }}
            >
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
                  containerClassName={cls.streamingBox}
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
  streamingBox: {
    ...softBorderRadius,
    overflow: 'hidden',
  },

  // Mobile
  mobileBoard: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  mobileAwayPlayerWrapper: {
    // marginBottom: '4px',
    padding: '0 8px',
  },
  mobileHomePlayerWrapper: {
    // marginTop: '4px',
    padding: '0 8px',
  },
});
