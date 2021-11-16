import React, { useCallback, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGameHistoryConsumer, ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import cx from 'classnames';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import { spacers } from 'src/theme/spacers';
import { RelayedChessGame } from 'src/modules/Games/Chess/components/RelayedChessGame/RelayedChessGame';
import { RoomRelayActivity } from '../types';
import { console } from 'window-or-global';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
};

export const RelayActivity: React.FC<Props> = ({activity, deviceSize}) => {
  const cls = useStyles();
  
  const  {game} = activity;

  // useEffect(() => {
  //   console.log("Activity inside the RelayActivity component changed", activity);
  // },[activity])

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize, leftSide }) => (
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
                  {game  && <RelayedChessGame
                    // Reset the State each time the game id changes
                    key={game.id}
                    game={game}
                    size={boardSize}
                    orientation={'white'}
                    playable={false}
                    canInteract={false}
                    displayable={c.displayed}
                    className={cls.board}
                    // viewOnly
                    drawable={{
                      visible: true,
                      enabled:true,
                    }}
                  />}
                  <BoardSettingsWidgetRoomConsumer containerClassName={cls.settingsBar} />
                </div>
              )}
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