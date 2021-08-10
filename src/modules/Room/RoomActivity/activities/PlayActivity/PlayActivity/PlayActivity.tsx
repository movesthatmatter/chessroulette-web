import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { Game } from 'src/modules/Games';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { chessHistoryToSimplePgn, otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { GameActions, useGameActions } from 'src/modules/Games/GameActions';
import { spacers } from 'src/theme/spacers';
import { Button } from 'src/components/Button';
import { useDispatch } from 'react-redux';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { ActivityCommonProps } from '../../types';
import { switchRoomActivityAction } from '../../../redux/actions';
import { RoomPlayActivityWithGame } from '../types';
import { PlayActivityMobile } from './PlayActivityMobile';

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
                // homeColor={homeColor}
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
});
