import { Box } from 'grommet';
import React, { LegacyRef, useRef } from 'react';
import { NavigationHeader, UserMenu } from 'src/components/Navigation';
import { createUseStyles } from 'src/lib/jss';
import { GameRoomLayout } from 'src/modules/GameRoomV2/GameRoomLayout/GameRoomLayout';
import { borderRadius, colors, floatingShadow, softBorderRadius } from 'src/theme';
import cx from 'classnames';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { GameActions } from '../components/GameActions';
import { ChessGameV2 } from 'src/modules/Games/Chess/components/ChessGameV2';
import { StreamingBox } from 'src/components/StreamingBox';
import { faComment, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { ChatContainer } from 'src/modules/Chat';
import { LayoutProps } from '../types';
import { RoomDetails } from '../components/RoomDetails';
import { ExitRoomButton } from '../components/ExitRoomButton/ExitRoomButton';
import { TabComponent } from '../components/TabComponent/TabComponent';
import { ActivityLog } from '../../../RoomActivity/ActivityLog';

type Props = LayoutProps;

const TOP_HEIGHT = 80;
const BOTTOM_HEIGHT = 80;

export const DesktopLayout: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dialogTarget = useRef();
  const chessboardRef = useRef();

  const { game } = props;

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
                flexDirection: 'row',
                display: 'flex',
              }}
            >
              <div style={{ flex: 1 }}>
                <NavigationHeader logoAsLink={false} />
              </div>
              <div
                style={{
                  height: `${TOP_HEIGHT}px`,
                  paddingRight: '30px',
                }}
              >
                <UserMenu reversed withDropMenu linksTarget="blank" />
              </div>
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
                onHistoryFocusedIndexChanged={props.onHistoryIndexUpdated}
                // TODO: This should probably be seperate from the GameStateWidget
                //  something like a hook so it can be used without a view component
                onTimerFinished={props.onTimerFinished}
              />
            </div>
            {props.meAsPlayer && (
              <GameActions
                game={game}
                player={props.meAsPlayer}
                onAbort={props.onAbort}
                onRematchOffer={props.onRematchOffer}
                onOfferDraw={props.onOfferDraw}
                onResign={props.onResign}
                className={cls.gameActionsContainer}
                roomActivity={props.room.activity}
              />
            )}
          </div>
        )}
        getGameComponent={({ container }) => (
          <Box
            fill
            style={{ width: 'fit-content', height: 'fit-content', ...borderRadius }}
            ref={chessboardRef as any}
          >
            <ChessGameV2
              id={game.id}
              pgn={props.displayedPgn === undefined ? game.pgn : props.displayedPgn}
              onMove={({ move, pgn }) => {
                props.onMove(move, pgn, [], props.homeColor);
              }}
              size={container.width}
              homeColor={props.homeColor}
              playable={props.playable}
              className={cls.board}
              notificationDialog={props.gameNotificationDialog}
            />
          </Box>
        )}
        getRightSideComponent={({ container }) => (
          <div className={cx(cls.side, cls.rightSide)}>
            <div
              style={{
                height: `${TOP_HEIGHT}px`,
              }}
            >
              <div style={{ paddingTop: '16px' }} />
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RoomDetails />
                <div
                  style={{
                    flex: 1,
                  }}
                />
                <ExitRoomButton />
              </div>
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
              <TabComponent
                tabs={[
                  {
                    title: 'Activity Log',
                    content: (
                      <div
                        style={{
                          overflow: 'hidden',
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                          }}
                        >
                          <ActivityLog
                            containerStyle={{
                              flex: 1,
                              height: '100%',
                              borderBottom: `1px solid ${colors.neutral}`
                            }}
                            game={game}
                          />
                          <div style={{
                            height: `${BOTTOM_HEIGHT + container.verticalPadding - 1}px`,
                          }} />
                        </div>
                      </div>
                    ),
                    icon: faListAlt,
                  },
                  {
                    title: 'Messages',
                    content: (
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
                    ),
                    icon: faComment,
                  },
                ]}
              />
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
