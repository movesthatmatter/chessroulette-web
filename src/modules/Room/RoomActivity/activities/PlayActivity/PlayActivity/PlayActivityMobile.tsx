import { ChessGameColor, SimplePGN } from 'chessroulette-io';
import { otherChessColor } from 'chessroulette-io/dist/chessGame/util/util';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGame } from 'src/modules/Games/Chess';
import {
  ChessGameHistoryConsumer,
  ChessGameHistoryProvider,
  ChessGameHistoryProviderProps,
} from 'src/modules/Games/Chess/components/GameHistory';
import { useGameTimesLeft } from 'src/modules/Games/Chess/components/GameStateWidget/useGameState';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { historyToPgn } from 'src/modules/Games/Chess/lib';
import { GenericLayoutMobileRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutMobileRoomConsumer';
import { MobileChatWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/MobileChatWidgetRoomConsumer';
import { MobileGameActionsWidget } from 'src/modules/Room/widgets/MobileGameActionsWidget';
import { floatingShadow, onlySmallMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { ActivityCommonProps } from '../../types';
import { RoomPlayActivityWithGame } from '../types';
import { roomPlayActivityParticipantToChessPlayer } from '../util';

type Props = ActivityCommonProps & {
  activity: RoomPlayActivityWithGame;
  homeColor: ChessGameColor;
  onMoved: ChessGameHistoryProviderProps['onMoved'];
  onTimerFinished: (color: ChessGameColor) => void;
  displayedPgn?: SimplePGN;
};

export const PlayActivityMobile: React.FC<Props> = ({
  activity,
  homeColor,
  onMoved,
  onTimerFinished,
}) => {
  const cls = useStyles();
  const { game } = activity;

  const { away: awayTimeLeft, home: homeTimeLeft } = useGameTimesLeft(
    game,
    activity.iamParticipating
      ? {
          away: activity.participants.opponent,
          home: activity.participants.me,
        }
      : {
          home: activity.participants[homeColor],
          away: activity.participants[otherChessColor(homeColor)],
        }
  );

  return (
    <GenericLayoutMobileRoomConsumer
      renderTopOverlayMain={(dimensions) => (
        <div
          className={cls.iconButtonsContainer}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <MobileChatWidgetRoomConsumer containerHeight={dimensions.mainAreaContainer.height} />
          <div style={{ height: spacers.smaller }} />
          {activity.iamParticipating && <MobileGameActionsWidget activity={activity} />}
        </div>
      )}
      renderActivity={({ boardSize }) => (
        <ChessGameHistoryProvider history={game.history || []} onMoved={onMoved}>
          <div className={cls.mobileMainContainer}>
            {activity.iamParticipating && (
              <div className={cls.mobilePlayerWrapper}>
                <PlayerBox
                  // This is needed for the countdown to reset the interval !!
                  key={`${game.id}-${activity.participants.opponent.color}`}
                  player={roomPlayActivityParticipantToChessPlayer(activity.participants.opponent)}
                  timeLeft={awayTimeLeft}
                  active={
                    game.state === 'started' &&
                    game.lastMoveBy !== activity.participants.opponent.color
                  }
                  gameTimeLimitClass={game.timeLimit}
                  material={activity.participants.opponent.materialScore}
                  onTimerFinished={() => onTimerFinished(activity.participants.opponent.color)}
                />
              </div>
            )}
            <div className={cls.mobileChessGameWrapper}>
              <ChessGameHistoryConsumer
                render={(c) => (
                  <ChessGame
                    // Reset the State each time the game id changes
                    key={game.id}
                    game={game}
                    size={boardSize}
                    canInteract={activity.iamParticipating}
                    playableColor={
                      activity.iamParticipating ? activity.participants.me.color : homeColor
                    }
                    playable={activity.iamParticipating && activity.participants.me.canPlay}
                    displayable={c.displayed}
                    className={cls.board}
                    onAddMove={c.onAddMove}
                  />
                )}
              />
            </div>
            {activity.iamParticipating && (
              <div className={cls.mobilePlayerWrapper}>
                <PlayerBox
                  // This is needed for the countdown to reset the interval !!
                  key={`${game.id}-${activity.participants.me.color}`}
                  player={roomPlayActivityParticipantToChessPlayer(activity.participants.me)}
                  timeLeft={homeTimeLeft}
                  active={
                    game.state === 'started' && game.lastMoveBy !== activity.participants.me.color
                  }
                  gameTimeLimitClass={game.timeLimit}
                  material={activity.participants.me.materialScore}
                  onTimerFinished={() => onTimerFinished(activity.participants.opponent.color)}
                />
              </div>
            )}
          </div>
        </ChessGameHistoryProvider>
      )}
    />
  );
};

const useStyles = createUseStyles({
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  iconButtonsContainer: {
    padding: '0 12px 8px',

    ...onlySmallMobile({
      padding: '0 8px 4px',
    }),
  },

  mobileMainContainer: {
    paddingBottom: spacers.small,
  },
  mobileBoard: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  mobileChessGameWrapper: {
    padding: '6px 12px 8px',

    ...onlySmallMobile({
      paddingLeft: '30px',
      paddingRight: '30px',
    }),
  },
  mobilePlayerWrapper: {
    padding: '0 12px',

    ...onlySmallMobile({
      padding: '0 8px',
    }),
  },
});
