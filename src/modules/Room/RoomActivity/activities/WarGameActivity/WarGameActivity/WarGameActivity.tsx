import React, { useEffect, useMemo, useCallback } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { useGameActions } from 'src/modules/Games/WarGame/gameActions';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { ActivityCommonProps } from '../../types';
import { RoomWarGameParticipantsByColor, RoomWarGameActivityWithGame } from '../types';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { WarGameMove } from 'dstnd-io';
import { WarGameBoard } from 'wargame-board';
import { WarGameSateWidget } from 'src/modules/Games/WarGame/components/WarGameStateWidget/WarGameStateWidget';
import { WarGameActions } from 'src/modules/Games/WarGame/components/WarGameActions/WarGameActions';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

export type WarGameActivityProps = ActivityCommonProps & {
  activity: RoomWarGameActivityWithGame;
};

const getParticipantsByColor = (
  activity: RoomWarGameActivityWithGame
): RoomWarGameParticipantsByColor => {
  return activity.iamParticipating
    ? ({
        [activity.participants.me.color]: activity.participants.me,
        [activity.participants.opponent.color]: activity.participants.opponent,
      } as RoomWarGameParticipantsByColor)
    : activity.participants;
};

// This always defaults to White
const getHomeColor = (
  activity: RoomWarGameActivityWithGame,
  orientationInverted: boolean = false
) => {
  const homeColor = activity.iamParticipating ? activity.participants.me.color : 'white';

  return orientationInverted ? otherChessColor(homeColor) : homeColor;
};

export const WarGameActivity: React.FC<WarGameActivityProps> = ({ activity, deviceSize }) => {
  const cls = useStyles();
  const gameActions = useGameActions();
  const roomConsumer = useRoomConsumer();
  const {theme} = useColorTheme();
  const homeColor = useMemo(
    () => getHomeColor(activity, roomConsumer?.boardOrientation === 'away'),
    [activity, roomConsumer?.boardOrientation]
  );
  const participantsByColor = useMemo(() => getParticipantsByColor(activity), [activity]);
  const playableColor = activity.iamParticipating ? activity.participants.me.color : homeColor;

  const { game } = activity;

  const onMoved = (m: WarGameMove) => {
    gameActions.onMove(m, game.history || [], playableColor);
  };

  if (deviceSize.isMobile) {
    return null;
  }

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize, leftSide }) => (
        <>
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
                  <WarGameSateWidget
                    key={game.id}
                    game={game}
                    participants={participantsByColor}
                    homeColor={homeColor}
                    onTimerFinished={gameActions.onTimerFinished}
                  />
                </div>
              </div>
              <div className={cls.sideBottom}>
                {activity.iamParticipating && (
                  <WarGameActions
                    activity={activity}
                    className={cx(cls.sideBottom, cls.floatingBoxOffsets)}
                  />
                )}
              </div>
            </aside>
            <WarGameBoard
              key={game.id}
              game={game}
              size={boardSize}
              orientation={homeColor}
              turnColor={otherChessColor(game.lastMoveBy ? game.lastMoveBy : 'black')}
              canInteract={activity.iamParticipating}
              playable={activity.iamParticipating && activity.participants.me.canPlay}
              playableColor={otherChessColor(game.lastMoveBy ? game.lastMoveBy : 'black')}
              className={cls.board}
              onMove={(move, type) => onMoved({ move, type })}
              theme={theme.name === 'darkDefault' ? 'dark' : 'light'}
            />
          </div>
        </>
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
