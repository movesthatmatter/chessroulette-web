import React, { useCallback, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  ChessGameHistoryConsumer,
  ChessGameHistoryProvider,
} from 'src/modules/Games/Chess/components/GameHistory';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import cx from 'classnames';
import { CustomTheme, floatingShadow, softBorderRadius } from 'src/theme';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import { spacers } from 'src/theme/spacers';
import {effects} from 'src/theme/effects';
import { RelayedChessGame } from 'src/modules/Games/Chess/components/RelayedChessGame/RelayedChessGame';
import { RoomRelayActivity } from '../types';
import { console } from 'window-or-global';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { noop } from 'src/lib/util';
import { RelayLiveGameList } from '../components/RelayLiveGameList';
import { Game } from 'src/modules/Games';
import { FloatingBox } from 'src/components/FloatingBox';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
  onSelectedRelay: (relayId: string) => void;
};

export const RelayActivity: React.FC<Props> = ({ activity, deviceSize, onSelectedRelay }) => {
  const cls = useStyles();

  const { game } = activity;

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize, leftSide }) => (
        <div className={cls.container}>
          <aside
            className={cls.side}
            style={{ height: boardSize, width: leftSide.width}}
          >
            {game ? (
              <>
                <div className={cls.sideTop} />
                <div
                  style={{ height: '40%' }}
                  className={cx(cls.floatingBoxContainerOffsets, cls.gameStateWidgetContainer)}
                ></div>
              </>
            ) : (
              <div className={cls.box} style={{height: leftSide.height}}>
                <RelayLiveGameList
                  onSelect={onSelectedRelay}
                />
              </div>
            )}
          </aside>
          <ChessGameHistoryConsumer
            render={(c) => (
              <div>
                {game ? (
                  <>
                    <RelayedChessGame
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
                        enabled: true,
                      }}
                    />
                    <BoardSettingsWidgetRoomConsumer containerClassName={cls.settingsBar} />
                  </>
                ) : (
                  <ChessBoard
                    type="free"
                    onMove={noop}
                    size={boardSize}
                    playableColor="white"
                    pgn=""
                    id="empty-free-board-relay"
                    className={cls.board}
                  />
                )}
              </div>
            )}
          />
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
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
  box: {
    marginLeft: `${-spacers.defaultPx}px`,
    marginRight: spacers.default,
    backgroundColor: theme.depthBackground.backgroundColor,
    ...(theme.name === 'lightDefault'
      ? {
          ...effects.softOutline,
          ...effects.floatingShadow,
        }
      : {
          ...effects.softFloatingShadowDarkMode,
        }),
    ...softBorderRadius,
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
}));
