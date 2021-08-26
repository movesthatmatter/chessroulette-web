import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { RoomAnalysisActivity } from './types';
import { spacers } from 'src/theme/spacers';
import { ActivityCommonProps } from '../types';
import { ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { ChessGameHistoryProvided } from 'src/modules/Games/Chess/components/GameHistory';

export type AnalysisActivityProps = ActivityCommonProps & {
  boardSize: number;
  analysis: NonNullable<RoomAnalysisActivity['analysis']>;
};

export const AnalysisActivity: React.FC<AnalysisActivityProps> = ({ analysis, boardSize }) => {
  const cls = useStyles();

  return (
    <ChessGameHistoryConsumer
      render={({ displayedHistory, onAddMove, displayedIndex }) => (
        <div className={cls.container}>
          <aside className={cls.side} style={{ height: boardSize }}>
            <ChessGameHistoryProvided className={cls.gameStateContainer} />
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
              pgn={
                displayedHistory
                  ? chessHistoryToSimplePgn(displayedHistory)
                  : analysis.history
                  ? chessHistoryToSimplePgn(analysis.history)
                  : ''
              }
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
    marginRight: spacers.large,
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

  gameStateContainer: {
    height: '100%',
    background: colors.white,
    ...floatingShadow,
    ...softBorderRadius,
    // height: 'calc(100% - 80px)',
    minHeight: '100px',
    minWidth: '130px',
  },
});
