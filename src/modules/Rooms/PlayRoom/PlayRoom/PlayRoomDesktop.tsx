import React from 'react';
import { Box } from 'grommet';
import cx from 'classnames';
import { NavigationHeader, UserMenu } from 'src/components/Navigation';
import { createUseStyles } from 'src/lib/jss';
import { borderRadius, colors, floatingShadow, softBorderRadius } from 'src/theme';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { GameActions, useGameActions } from '../../../Games/GameActions';
import { StreamingBox } from 'src/components/StreamingBox';
import { RoomDetails } from '../../components/RoomDetails';
import { ExitRoomButton } from '../../components/ExitRoomButton/ExitRoomButton';
import { ChessGame } from 'src/modules/Games/Chess';
import { PlayProps } from './types';
import { DesktopLayout } from '../Layouts';
import { RoomTabsWidget } from './widgets/RoomTabsWidget';

type Props = PlayProps;

const TOP_HEIGHT = 80;
const BOTTOM_HEIGHT = 80;

export const PlayRoomDesktop: React.FC<Props> = ({ game, ...props }) => {
  const cls = useStyles();
  const gameActions = useGameActions();

  return (
    <div className={cls.container}>
      <DesktopLayout
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
                <NavigationHeader />
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
        getLeftSideComponent={({ container, main }) => (
          <div
            className={cls.side}
            style={{
              flex: 1,
              height: container.height,
              paddingLeft: `${main.horizontalPadding < 32 ? 32 - main.horizontalPadding : 0}px`,
            }}
          >
            <div style={{ height: '30%' }} />
            <div style={{ height: '40%' }}>
              <GameStateWidget
                // This is needed for the countdown to reset the interval !!
                key={game.id}
                game={game}
                homeColor={props.homeColor}
                historyFocusedIndex={props.historyIndex}
                onHistoryFocusedIndexChanged={props.onHistoryIndexUpdated}
                // TODO: This should probably be seperate from the GameStateWidget
                //  something like a hook so it can be used without a view component
                onTimerFinished={gameActions.onTimerFinished}
              />
            </div>
            {props.meAsPlayer && (
              <GameActions
                game={game}
                myPlayer={props.meAsPlayer}
                className={cls.gameActionsContainer}
                roomActivity={props.room.activity}
              />
            )}
          </div>
        )}
        getGameComponent={({ container }) => (
          <Box fill style={{ width: 'fit-content', height: 'fit-content', ...borderRadius }}>
            <ChessGame
              // Reset the State each time the game id changes
              key={game.id}
              game={game}
              displayedPgn={props.displayedPgn}
              homeColor={props.homeColor}
              size={container.width}
              playable={props.playable}
              className={cls.board}
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
                <div style={{ flex: 1 }} />
                <ExitRoomButton />
              </div>
            </div>
            <div
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
              <RoomTabsWidget
                game={game}
                me={props.room.me.user}
                bottomContainerHeight={BOTTOM_HEIGHT + container.verticalPadding - 1}
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
  rightSide: {
    background: colors.white,
    paddingLeft: '30px',
    paddingRight: '30px',
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
