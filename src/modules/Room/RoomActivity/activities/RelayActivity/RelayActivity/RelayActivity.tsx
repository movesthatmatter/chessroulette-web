import React, { useCallback, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  ChessGameHistoryConsumer,
} from 'src/modules/Games/Chess/components/GameHistory';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import cx from 'classnames';
import { CustomTheme, floatingShadow, softBorderRadius } from 'src/theme';
import { floatingBoxContainerOffsets, floatingBoxOffsets } from '../../styles';
import { spacers } from 'src/theme/spacers';
import { effects } from 'src/theme/effects';
import { RelayedChessGame } from 'src/modules/Games/Chess/components/RelayedChessGame/RelayedChessGame';
import { RoomRelayActivity } from '../types';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { noop } from 'src/lib/util';
import { RelayLiveGameList } from '../components/RelayLiveGameList';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { PgnBox } from '../../AnalysisActivity/components/PgnBox';
import { SimplePGN } from 'dstnd-io';

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
          <aside className={cls.side} style={{ height: boardSize, width: leftSide.width }}>
            {game ? (
              <>
                <div className={cls.sideTop} />
                <div
                  style={{ height: '60%' }}
                  className={cx(cls.floatingBoxContainerOffsets, cls.gameStateWidgetContainer)}
                >
                  <div className={cls.floatingBoxOffsets}>
                    <GameStateWidget
                      // This is needed for the countdown to reset the interval !!
                      key={game.id}
                      game={game}
                      homeColor={'white'}
                      onTimerFinished={noop}
                    />
                  </div>
                </div>
                <div className={cls.sideBottom}>
                  {game.pgn && (
                    <PgnBox
                      pgn={game.pgn as SimplePGN}
                      containerClassName={cls.pgnBoxContainer}
                      contentClassName={cls.pgnBox}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={cls.box} style={{ height: leftSide.height }}>
                <RelayLiveGameList onSelect={onSelectedRelay} />
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

const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

const useStyles = createUseStyles<CustomTheme>((theme) => ({
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
    height: '20%',
  },
  sideBottom: {
    height: '20%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: spacers.default,
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
  pgnBoxContainer: {
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,

    paddingTop: spacers.default,

    '&:first-child': {
      paddingTop: 0,
    },

    '&:last-child': {
      marginBottom: 0,
    },
  },
  pgnBox: {
    overflowY: 'hidden',
  },
}));
