import React, { useEffect, useMemo } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { GameActions, useGameActions } from 'src/modules/Games/GameActions';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { ActivityCommonProps } from '../../types';
import { RoomPlayActivityWithGame, RoomPlayParticipantsByColor } from '../types';
import { PlayActivityMobile } from './PlayActivityMobile';
import {
  ChessGameHistoryProvider,
  ChessGameHistoryConsumer,
} from 'src/modules/Games/Chess/components/GameHistory';
import { historyToPgn } from 'src/modules/Games/Chess/lib';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import cx from 'classnames';
import { useFeedbackActions } from 'src/providers/FeedbackProvider/useFeedback';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { spacers } from 'src/theme/spacers';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';

export type PlayActivityProps = ActivityCommonProps & {
  activity: RoomPlayActivityWithGame;
};

const getParticipantsByColor = (
  activity: RoomPlayActivityWithGame
): RoomPlayParticipantsByColor => {
  return activity.iamParticipating
    ? ({
        [activity.participants.me.color]: activity.participants.me,
        [activity.participants.opponent.color]: activity.participants.opponent,
      } as RoomPlayParticipantsByColor)
    : activity.participants;
};

// This always defaults to White
const getHomeColor = (activity: RoomPlayActivityWithGame, orientationInverted: boolean = false) => {
  const homeColor = activity.iamParticipating ? activity.participants.me.color : 'white';

  return orientationInverted ? otherChessColor(homeColor) : homeColor;
};

export const PlayActivity: React.FC<PlayActivityProps> = ({ activity, deviceSize }) => {
  const cls = useStyles();
  const gameActions = useGameActions();
  const feedbackActions = useFeedbackActions();
  const roomConsumer = useRoomConsumer();
  const homeColor = useMemo(
    () => getHomeColor(activity, roomConsumer?.boardOrientation === 'away'),
    [activity, roomConsumer?.boardOrientation]
  );
  const participantsByColor = useMemo(() => getParticipantsByColor(activity), [activity]);

  const { game } = activity;

  useEffect(() => {
    if (activity.iamParticipating && game.winner === activity.participants.me.color) {
      feedbackActions.attemptToShowIfPossible();
    }
  }, [activity.iamParticipating, game]);

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
                    playParticipants={participantsByColor}
                    homeColor={homeColor}
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
                <div>
                  <ChessGame
                    // Reset the State each time the game id changes
                    key={game.id}
                    game={game}
                    size={boardSize}
                    orientation={homeColor}
                    canInteract={activity.iamParticipating}
                    playable={activity.iamParticipating && activity.participants.me.canPlay}
                    playableColor={
                      activity.iamParticipating ? activity.participants.me.color : homeColor
                    }
                    displayedPgn={historyToPgn(c.displayedHistory)}
                    // autoCommitMove // TODO: Add this and try it outs
                    className={cls.board}
                  />
                  <BoardSettingsWidgetRoomConsumer containerClassName={cls.settingsBar} />
                </div>
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
  settingsBar: {
    paddingTop: spacers.default,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
