import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, onlySmallMobile, softBorderRadius } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { Game } from 'src/modules/Games';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { GameActions, useGameActions } from 'src/modules/Games/GameActions';
import { spacers } from 'src/theme/spacers';
import { Button } from 'src/components/Button';
import { useDispatch } from 'react-redux';
// import { RoomPlayActivityWithGame } from 'src/modules/Room/Activities/PlayActivity';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/RoomV3/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { GenericLayoutMobileRoomConsumer } from 'src/modules/RoomV3/RoomConsumers/GenericLayoutMobileRoomConsumer';
import { NavigationHeader } from 'src/modules/Room/LayoutProvider/RoomLayoutProvider/components/NavigationHeader';
import { MobileChatWidgetRoomConsumer } from 'src/modules/RoomV3/RoomConsumers/MobileChatWidgetRoomConsumer';
// import { MobileGameActionsWidget } from 'src/modules/Room/LayoutProvider/Layouts/Generic/RoomLayout/MobileRoomLayout/widgets/MobileGameActionsWidget';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { ActivityCommonProps } from '../../types';
import { switchRoomActivityAction } from '../../../redux/actions';
import { RoomPlayActivityWithGame } from '../types';
import { MobileGameActionsWidget } from 'src/modules/RoomV3/widgets/MobileGameActionsWidget';

export type PlayActivityProps = ActivityCommonProps & {
  activity: RoomPlayActivityWithGame;
};

export const PlayActivity: React.FC<PlayActivityProps> = ({ activity, deviceSize }) => {
  const cls = useStyles();
  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);
  const [displayedPgn, setDisplayedPgn] = useState<Game['pgn']>();
  const gameActions = useGameActions();

  // Default to White
  const homeColor = activity.iamParticipating ? activity.participants.me.color : 'white';
  const { game } = activity;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!game) {
      return;
    }

    if (!game.history || game.history.length === 0 || gameDisplayedHistoryIndex === 0) {
      setDisplayedPgn(undefined);
      return;
    }

    const nextPgn = chessHistoryToSimplePgn(game.history.slice(0, -gameDisplayedHistoryIndex));

    setDisplayedPgn(nextPgn);
  }, [game, gameDisplayedHistoryIndex]);

  console.log('[RoomV3] Play activity');

  if (deviceSize.isMobile) {
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
            <div
              style={{
                height: spacers.smaller,
              }}
            />
            {activity.iamParticipating && <MobileGameActionsWidget activity={activity} />}
          </div>
        )}
        renderActivity={({ boardSize }) => (
          <div className={cls.mobileMainContainer}>
            {/* {activity.iamParticipating && activity.participants.opponent && (
              <div className={cls.mobilePlayerWrapper}>
                <PlayerBox
                  // This is needed for the countdown to reset the interval !!
                  key={`${game.id}-${activity.participants.opponent.color}`}
                  player={activity.participants.opponent}
                  timeLeft={opponentTimeLeft}
                  active={
                    game.state === 'started' && game.lastMoveBy !== props.opponentAsPlayer.color
                  }
                  gameTimeLimit={game.timeLimit}
                  material={materialScore[props.opponentAsPlayer.color]}
                  onTimerFinished={gameActions.onTimerFinished}
                />
              </div>
            )} */}
            <div className={cls.mobileChessGameWrapper}>
              <ChessGame
                // Reset the State each time the game id changes
                key={game.id}
                game={game}
                size={boardSize}
                // size={
                //   dimensions.container.width - (windowWidth < SMALL_MOBILE_BREAKPOINT ? 60 : 24)
                // }
                homeColor={homeColor}
                playable={activity.iamParticipating && activity.participants.me.canPlay}
                displayedPgn={displayedPgn}
                className={cls.board}
              />
            </div>
            {/* {props.meAsPlayer && (
              <div className={cls.mobilePlayerWrapper}>
                <PlayerBox
                  // This is needed for the countdown to reset the interval !!
                  key={`${game.id}-${props.meAsPlayer.color}`}
                  player={props.meAsPlayer}
                  timeLeft={myTimeLeft}
                  active={game.state === 'started' && game.lastMoveBy !== props.meAsPlayer.color}
                  gameTimeLimit={game.timeLimit}
                  material={materialScore[props.meAsPlayer.color]}
                  onTimerFinished={gameActions.onTimerFinished}
                />
              </div>
            )} */}
          </div>
        )}
      />
    );
  }

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize }) => (
        <div className={cls.container}>
          <aside className={cls.side} style={{ height: boardSize }}>
            <div className={cls.sideTop}>
              <Button
                label="Analyze"
                onClick={() => {
                  dispatch(switchRoomActivityAction({ type: 'analysis' }));
                }}
              />
            </div>
            <div style={{ height: '40%' }}>
              <GameStateWidget
                // This is needed for the countdown to reset the interval !!
                key={game.id}
                game={game}
                homeColor={homeColor}
                historyFocusedIndex={gameDisplayedHistoryIndex}
                onHistoryFocusedIndexChanged={setGameDisplayedHistoryIndex}
                // TODO: This should probably be seperate from the GameStateWidget
                //  something like a hook so it can be used without a view component
                onTimerFinished={gameActions.onTimerFinished}
              />
            </div>
            {activity.iamParticipating && (
              <GameActions activity={activity} className={cls.sideBottom} />
            )}
          </aside>
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
    marginRight: spacers.large,
  },
  sideTop: {
    height: '30%',
  },
  sideBottom: {
    height: '30%',
  },

  /// Mobile
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
