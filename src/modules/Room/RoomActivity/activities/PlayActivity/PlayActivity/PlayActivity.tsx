import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { GameActions, useGameActions } from 'src/modules/Games/GameActions';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { ActivityCommonProps } from '../../types';
import { RoomPlayActivityWithGame } from '../types';
import { PlayActivityMobile } from './PlayActivityMobile';
import {
  ChessGameHistoryProvider,
  ChessGameHistoryConsumer,
} from 'src/modules/Games/Chess/components/GameHistory';
import { historyToPgn } from 'src/modules/Games/Chess/lib';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import cx from 'classnames';

export type PlayActivityProps = ActivityCommonProps & {
  activity: RoomPlayActivityWithGame;
};

export const PlayActivity: React.FC<PlayActivityProps> = ({ activity, deviceSize }) => {
  const cls = useStyles();
  const gameActions = useGameActions();

  // Default to White
  const homeColor = activity.iamParticipating ? activity.participants.me.color : 'white';
  const { game } = activity;

  if (deviceSize.isMobile) {
    return (
      <PlayActivityMobile
        activity={activity}
        deviceSize={deviceSize}
        homeColor={homeColor}
        onTimerFinished={gameActions.onTimerFinished}
      />
    );
  }

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize, leftSide }) => (
        <ChessGameHistoryProvider history={game.history || []}>
          <div className={cls.container}>
            <aside
              className={cls.side}
              style={{ height: boardSize, width: leftSide.width + leftSide.horizontalPadding }}
            >
              <div className={cls.sideTop} />
              <div
                style={{ height: '40%' }}
                className={cx(cls.floatingBoxContainerOffsets, cls.gameStateWidgetContainer)}
              >
                <div className={cls.floatingBoxOffsets}>
                  <GameStateWidget
                    // This is needed for the countdown to reset the interval !!
                    key={game.id}
                    game={game}
                    playParticipants={
                      activity.iamParticipating
                        ? {
                            home: activity.participants.me,
                            away: activity.participants.opponent,
                          }
                        : {
                            home: activity.participants[homeColor],
                            away: activity.participants[otherChessColor(homeColor)],
                          }
                    }
                    // TODO: This should probably be seperate from the GameStateWidget
                    //  something like a hook so it can be used without a view component
                    onTimerFinished={gameActions.onTimerFinished}
                  />
                </div>
              </div>
              <div className={cls.sideBottom}>
                {activity.iamParticipating && (
                  <GameActions
                    activity={activity}
                    className={cx(cls.sideBottom, cls.floatingBoxOffsets)}
                  />
                )}
              </div>
            </aside>
            <ChessGameHistoryConsumer
              render={(c) => (
                <ChessGame
                  // Reset the State each time the game id changes
                  key={game.id}
                  game={game}
                  size={boardSize}
                  homeColor={homeColor}
                  playable={activity.iamParticipating && activity.participants.me.canPlay}
                  displayedPgn={historyToPgn(c.displayedHistory)}
                  // autoCommitMove // TODO: Add this and try it outs
                  className={cls.board}
                />
              )}
            />
          </div>
        </ChessGameHistoryProvider>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  sideTop: {
    height: '30%',
  },
  sideBottom: {
    height: '30%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  gameStateWidgetContainer: {
    display: 'flex',
    flex: 1,
  },

  floatingBoxContainerOffsets: {
    ...floatingBoxContainerOffsets,

    // This is an override
    marginBottom: 0,
  },
  floatingBoxOffsets: {
    ...floatingBoxOffsets,
    flex: 1,
  },
});
