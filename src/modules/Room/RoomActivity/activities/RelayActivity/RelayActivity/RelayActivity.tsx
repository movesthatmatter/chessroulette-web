import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';
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
import { useEngineAnalysis } from 'src/modules/Games/Chess/components/EngineAnalysis';
import { DrawShape } from 'chessground/draw';
import { EngineLines } from 'src/modules/Games/Chess/components/EngineAnalysis/EngineLines';
import {
  EngineAnalysisRecord,
  EngineDepthLine,
} from 'src/modules/Games/Chess/components/EngineAnalysis/types';
import { ChessGameColor, SimplePGN } from 'dstnd-io';
import { IconButton } from 'src/components/Button';
import { colors } from 'src/theme/colors';
import { Swap } from 'react-iconly';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
  onSelectedRelay: (relayId: string) => void;
};

export const RelayActivity: React.FC<Props> = ({ activity, deviceSize, onSelectedRelay }) => {
  const cls = useStyles();
  const [orientation, setOrientation] = useState<ChessGameColor>('white');
  const { game } = activity;

  const engineEvaluation = useEngineAnalysis(game);

  const [drawingShapes, setDrawingShapes] = useState<DrawShape[]>();

  useEffect(() => {
    if (!engineEvaluation) {
      setDrawingShapes(undefined);
      return;
    }

    const { bestMove } = engineEvaluation.evaluation || {};

    setDrawingShapes([
      ...(bestMove
        ? [
            {
              orig: bestMove.from,
              dest: bestMove.to,
              brush: 'green',
            },
          ]
        : []),
      // ...(r.ponderMove
      //   ? [
      //       {
      //         orig: r.ponderMove.from,
      //         dest: r.ponderMove.to,
      //         brush: 'yellow',
      //       },
      //     ]
      //   : []),
    ]);
  }, [engineEvaluation]);

  const [engineLines, setEngineLines] = useState<EngineAnalysisRecord['info']>([]);

  // useEffect(() => {
  //   console.log('engineEvaluation updated', engineEvaluation?.info);

  //   setEngineLines(
  //     engineEvaluation
  //       ? engineEvaluation.info
  //           .slice(-3)
  //           .filter((l) => l.type === 'depthLine')
  //           .sort(
  //             (a, b) =>
  //               Math.abs((b as EngineDepthLine).score.value) -
  //               Math.abs((a as EngineDepthLine).score.value)
  //           )
  //       : []
  //   );
  // }, [engineEvaluation]);

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
                      homeColor={orientation}
                      onTimerFinished={noop}
                    />
                  </div>
                </div>
                <div className={cls.sideBottom}>
                  {<EngineLines lines={engineLines} />}
                  {/* <pre>{JSON.stringify(engineEvaluation, null, 2)}</pre> */}
                  {/* )} /> */}
                  {/* {game.pgn && (
                    <PgnBox
                      pgn={game.pgn as SimplePGN}
                      containerClassName={cls.pgnBoxContainer}
                      contentClassName={cls.pgnBox}
                    />
                  )} */}
                </div>
              </>
            ) : (
              <div className={cls.box} style={{ height: leftSide.height }}>
                <RelayLiveGameList onSelect={(g) => onSelectedRelay(g.id)} />
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
                      orientation={orientation}
                      playable={false}
                      canInteract={false}
                      displayable={c.displayed}
                      className={cls.board}
                      // viewOnly
                      drawable={{
                        visible: true,
                        enabled: true,
                        eraseOnClick: false,
                        autoShapes: drawingShapes || [],
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' , marginTop: spacers.small}}>
                      <IconButton
                        type="primary"
                        size="default"
                        title="Flip Board"
                        iconPrimaryColor={colors.universal.white}
                        className={cls.button}
                        iconType="iconly"
                        icon={Swap}
                        onSubmit={() =>
                          setOrientation((prev) => (prev === 'white' ? 'black' : 'white'))
                        }
                      />
                    </div>
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
    height: '30%',
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
  button: {
    background: theme.colors.primaryLight,
    marginBottom: 0,
  },
}));
