import { Box } from 'grommet';
import React, { LegacyRef, useRef, useState, useEffect } from 'react';
import { NavigationHeader, UserMenu } from 'src/components/Navigation';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { GameRoomLayout } from 'src/modules/GameRoomV2/GameRoomLayout/GameRoomLayout';
import { borderRadius, colors, floatingShadow, fonts, softBorderRadius } from 'src/theme';
import cx from 'classnames';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { GameActions } from '../components/GameActions';
import { ChessGameV2 } from 'src/modules/Games/Chess/components/ChessGameV2';
import { StreamingBox } from 'src/components/StreamingBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { ChatContainer } from 'src/modules/Chat';
import { LayoutProps } from '../types';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoardV2';
import { getOppositePlayer, getPlayer } from 'src/modules/GameRoomV2/util';
import { ChessPlayer } from 'dstnd-io';
import { PlayerPendingOverlay } from 'src/components/PlayerPendingOverlay/PlayerPendingOverlay';

type Props = LayoutProps;

const TOP_HEIGHT = 80;
const BOTTOM_HEIGHT = 80;

export const DesktopLayout: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dialogTarget = useRef();
  const { game } = props;
  const [gameReadyToPlay, setGameReadyToPlay] = useState(false);
  const getMePlayer = getPlayer(props.room.me.id, game.players);
  const getOtherPlayer = getOppositePlayer(getMePlayer as ChessPlayer, game.players);
  const chessboardRef = useRef();

  useEffect(() => {
    if (props.room && props.room.peersCount > 0) {
      setGameReadyToPlay(Object
        .values(props.room.peersIncludingMe)
        .filter(p => p.id === getOtherPlayer?.user.id)
        .length > 0)
    }
  }, [props.room.peersIncludingMe, props.room.peersCount]);

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
        getBottomComponent={() => null}
        // getBottomComponent={({ right, left, main }) => (
        //   <div
        //     style={{
        //       display: 'flex',
        //       flexDirection: 'row',
        //     }}
        //   >
        //     <div style={{ width: left.width }} />
        //     <div style={{ width: main.width }}>
        //       <Footer />
        //     </div>
        //     <div style={{ width: right.width }} />
        //   </div>
        // )}
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
                game={game}
                homeColor={props.homeColor}
                historyFocusedIndex={props.historyIndex}
                onMoveClick={props.onHistoryIndexUpdated}
                // TODO: This should probably be seperate from the GameStateWidget
                //  something like a hook so it can be used without a view component
                onTimerFinished={props.onTimerFinished}
              />
            </div>
            <GameActions
              game={game}
              onAbort={props.onAbort}
              onRematchOffer={props.onRematchOffer}
              onOfferDraw={props.onOfferDraw}
              onResign={props.onResign}
              className={cls.gameActionsContainer}
            />
          </div>
        )}
        getGameComponent={({ container }) => (
          <>
            <Box fill style={{width : 'fit-content', height: 'fit-content', ...borderRadius}} ref={chessboardRef as any}>
            <ChessGameV2
              game={game}
              onMove={({ move, pgn }) => {
                props.onMove(move, pgn, [], props.homeColor);
              }}
              size={container.width}
              homeColor={props.homeColor}
              playable={props.canIPlay}
              className={cls.board}
              viewOnly={!gameReadyToPlay}
            />
            </Box>
            {!gameReadyToPlay && <PlayerPendingOverlay target={chessboardRef.current} 
            size={Math.ceil(container.width / 4)}/>}
          </>
        )}
        getRightSideComponent={({ container }) => (
          <div className={cx(cls.side, cls.rightSide)}>
            <div
              style={{
                height: `${TOP_HEIGHT}px`,
              }}
            >
              <UserMenu reversed />
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
                  focusedPeerId={!!props.meAsPlayer ? props.opponentAsPlayer?.user.id : undefined}
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
                    height: `${BOTTOM_HEIGHT + container.verticalPadding}px`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
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
    height: '30%',
  },
  streamingBox: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
});
