import React from 'react';
import { NavigationHeader } from 'src/components/Navigation';
import { StreamingBox } from 'src/components/StreamingBox';
import { createUseStyles } from 'src/lib/jss';
import {
  floatingShadow,
  onlySmallMobile,
  SMALL_MOBILE_BREAKPOINT,
  softBorderRadius,
} from 'src/theme';
import { PlayProps } from './types';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { getRelativeMaterialScore } from 'src/modules/Games/Chess/components/GameStateWidget/util';
import { useWindowWidth } from '@react-hook/window-size';
import { useGameActions } from '../../../Games/GameActions';
import { ChessGame } from 'src/modules/Games/Chess/components/ChessGame';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { MobileLayout } from '../Layouts';
import { MobileChatWidget } from './widgets/MobileChatWidget';
import { MobileGameActionsWidget } from './widgets/MobileGameActionsWidget';

type Props = PlayProps;

export const PlayRoomMobile: React.FC<Props> = ({ game, ...props }) => {
  const cls = useStyles();
  const gameActions = useGameActions();

  // This should be container width
  const windowWidth = useWindowWidth();

  // TODO: These shouldn't be here!
  // TOODO: In fact the whole notion of timeleft is conceptualy wrong here.
  //   What I need to know at this level is timeSinceLastMove - which then gets passed to the countdown
  // or, if not then save the timeleft here or somewhere nad just feed it to a clock!
  //  Maybe it does make sense to use a hook then hmmm, which could then just give all the stats I need!
  const now = new Date();
  const myTimeLeft =
    game.state === 'started' && game.lastMoveBy !== props.homeColor
      ? game.timeLeft[props.homeColor] - (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[props.homeColor];
  const opponentTimeLeft =
    game.state === 'started' && game.lastMoveBy === props.homeColor
      ? game.timeLeft[otherChessColor(props.homeColor)] -
        (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[otherChessColor(props.homeColor)];
  const materialScore = getRelativeMaterialScore(game);

  return (
    <MobileLayout
      getTopArea={(dimensions) => (
        <StreamingBox
          room={props.room}
          focusedPeerId={!!props.meAsPlayer ? props.opponentAsPlayer?.user.id : undefined}
          aspectRatio={dimensions.container}
          headerOverlay={() => <NavigationHeader />}
          mainOverlay={() => (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <div
                className={cls.iconButtonsContainer}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <MobileChatWidget containerHeight={dimensions.mainAreaContainer.height} />
                <div />
                {props.meAsPlayer && (
                  <MobileGameActionsWidget
                    roomActivity={props.room.activity}
                    game={game}
                    myPlayer={props.meAsPlayer}
                  />
                )}
              </div>
            </div>
          )}
          // Account for the rounded border
          footerOverlay={() => <div style={{ height: '16px' }} />}
        />
      )}
      getMainArea={(dimensions) => (
        <div className={cls.mobileMainContainer}>
          {props.opponentAsPlayer && (
            <div className={cls.mobilePlayerWrapper}>
              <PlayerBox
                // This is needed for the countdown to reset the interval !!
                key={`${game.id}-${props.opponentAsPlayer.color}`}
                player={props.opponentAsPlayer}
                timeLeft={opponentTimeLeft}
                active={
                  game.state === 'started' && game.lastMoveBy !== props.opponentAsPlayer.color
                }
                gameTimeLimit={game.timeLimit}
                material={materialScore[props.opponentAsPlayer.color]}
                onTimerFinished={gameActions.onTimerFinished}
              />
            </div>
          )}
          <div className={cls.mobileChessGameWrapper}>
            <ChessGame
              key={game.id}
              game={game}
              playable={props.playable}
              homeColor={props.homeColor}
              size={dimensions.container.width - (windowWidth < SMALL_MOBILE_BREAKPOINT ? 60 : 24)}
              className={cls.mobileBoard}
              notificationDialog={props.gameNotificationDialog}
            />
          </div>
          {props.meAsPlayer && (
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
          )}
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
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
