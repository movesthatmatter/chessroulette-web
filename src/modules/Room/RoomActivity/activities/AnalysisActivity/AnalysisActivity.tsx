import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { RoomAnalysisActivity } from './types';
import { ActivityCommonProps } from '../types';
import { ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { LayoutContainerDimensions } from 'src/modules/Room/Layouts';
import { SimplePGN } from 'dstnd-io';
import { AnalysisPanel } from './components/AnalysisPanel';

export type AnalysisActivityProps = ActivityCommonProps & {
  boardSize: number;
  leftSide: LayoutContainerDimensions;
  analysis: NonNullable<RoomAnalysisActivity['analysis']>;

  onPgnImported: (pgn: SimplePGN) => void;
};

export const AnalysisActivity: React.FC<AnalysisActivityProps> = ({
  analysis,
  boardSize,
  leftSide,
  onPgnImported,
}) => {
  const cls = useStyles();
  const pgnFromHistory = analysis.history ? chessHistoryToSimplePgn(analysis.history) : '';

  return (
    <ChessGameHistoryConsumer
      render={({ history, displayedHistory, onAddMove, displayedIndex }) => (
        <div className={cls.container}>
          <aside className={cls.side} style={{ height: boardSize, width: leftSide.width }}>
            <AnalysisPanel
              analysisRecord={
                history.length > 0
                  ? {
                      history,
                      displayedHistory,
                    }
                  : undefined
              }
              onPgnImported={onPgnImported}
            />
          </aside>
          <div
            className={cls.boardContainer}
            style={{
              height: boardSize,
            }}
          >
            <ChessBoard
              size={boardSize}
              type="analysis"
              id={analysis.id}
              playable
              pgn={displayedHistory ? chessHistoryToSimplePgn(displayedHistory) : pgnFromHistory}
              homeColor="white"
              onMove={(m) => {
                onAddMove(
                  {
                    ...m.move,
                    clock: 0, // the clock doesn't matter on analysis
                  },
                  displayedIndex
                );
              }}
              className={cls.board}
            />
          </div>
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
  boardContainer: {
    ...floatingShadow,
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
  sideMiddle: {
    height: '40%',
  },
  sideBottom: {
    height: '30%',
  },
});
