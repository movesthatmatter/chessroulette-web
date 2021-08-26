import { ChessGameColor, SimplePGN } from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGame } from 'src/modules/Games/Chess';
import { useGameTimesLeft } from 'src/modules/Games/Chess/components/GameStateWidget/useGameState';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
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
  onTimerFinished: (color: ChessGameColor) => void;
  displayedPgn?: SimplePGN;
};

export const PlayActivityMobile: React.FC<Props> = ({
  activity,
  homeColor,
  onTimerFinished,
  displayedPgn,
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
                gameTimeLimit={game.timeLimit}
                material={activity.participants.opponent.materialScore}
                onTimerFinished={() => onTimerFinished(activity.participants.opponent.color)}
              />
            </div>
          )}
          <div className={cls.mobileChessGameWrapper}>
            <ChessGame
              // Reset the State each time the game id changes
              key={game.id}
              game={game}
              size={boardSize}
              homeColor={homeColor}
              playable={activity.iamParticipating && activity.participants.me.canPlay}
              displayedPgn={displayedPgn}
              className={cls.board}
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
                gameTimeLimit={game.timeLimit}
                material={activity.participants.me.materialScore}
                onTimerFinished={() => onTimerFinished(activity.participants.opponent.color)}
              />
            </div>
          )}
        </div>
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
    padding: '0 12px 4px',

    ...onlySmallMobile({
      padding: '0 8px 4px',
    }),
  },

  mobileMainContainer: {
    paddingBottom: '8px',
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
