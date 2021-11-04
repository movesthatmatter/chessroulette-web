import React, { useCallback } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGame } from 'src/modules/Games/Chess';
import { ChessGameHistoryConsumer, ChessGameHistoryProvider, ChessGameHistoryProviderProps } from 'src/modules/Games/Chess/components/GameHistory';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { RoomRelayActivity } from '../types';
import cx from 'classnames';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import { spacers } from 'src/theme/spacers';
import { useGameActions } from 'src/modules/Games/GameActions';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
};

export const RelayActivity: React.FC<Props> = ({activity, deviceSize}) => {
  const cls = useStyles();
  const {game} = activity;
  const gameActions = useGameActions();

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize, leftSide }) => (
        <ChessGameHistoryProvider
          key={game.id}
          history={game.history || []}
          // This could be moved up in a useCallback for optimization
        >
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
                    orientation={'white'}
                    canInteract={activity.iamParticipating}
                    playable={false}
                    playableColor={'white'}
                    displayable={c.displayed}
                    onAddMove={c.onAddMove}
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