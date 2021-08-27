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
import { FenBox } from './components/FenBox';
import { PgnBox } from './components/PgnBox';
import { LabeledFloatingBox } from './components/LabeledFloatingBox';
import cx from 'classnames';

export type AnalysisActivityProps = ActivityCommonProps & {
  boardSize: number;
  analysis: NonNullable<RoomAnalysisActivity['analysis']>;
};

export const AnalysisActivity: React.FC<AnalysisActivityProps> = ({ analysis, boardSize }) => {
  const cls = useStyles();

  return (
    <ChessGameHistoryConsumer
      render={({ history, displayedHistory, onAddMove, displayedIndex }) => (
        <div className={cls.container}>
          <aside className={cls.side} style={{ height: boardSize }}>
            <div className={cls.stretchedContainer}>
              <LabeledFloatingBox
                label="History"
                containerClassName={cx(cls.box, cls.historyContainer)}
                floatingBoxClassName={cls.history}
              >
                <ChessGameHistoryProvided />
              </LabeledFloatingBox>
              <FenBox historyOrPgn={history} containerClassName={cx(cls.box, cls.fenBox)} />
              <PgnBox
                historyOrPgn={history}
                containerClassName={cx(cls.box, cls.pgnBoxContainer)}
                contentClassName={cls.pgnBox}
              />
            </div>
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

  stretchedContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    alignItems: 'stretch',
    height: '100%',
  },

  historyContainer: {
    overflow: 'hidden',
    flex: 1,
  },
  history: {
    overflow: 'hidden',
  },

  box: {
    marginBottom: spacers.small,

    '&:last-child': {
      marginBottom: 0,
    },
  },
  fenBox: {
    flex: 0,
  },
  pgnBoxContainer: {
    maxHeight: '20%',
    overflow: 'hidden',
  },
  pgnBox: {
    overflow: 'hidden',
  },
});
