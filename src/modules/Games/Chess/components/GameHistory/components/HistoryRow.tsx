import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { isPartialBlackMove, PairedMove } from '../../../lib';
import cx from 'classnames';
import { HistoryList } from './HistoryList';
import { colors } from 'src/theme';
import { HTMLDivElement } from 'window-or-global';
import { ChessHistoryIndex } from 'dstnd-io';
import { isChessRecursiveHistoryIndex } from 'dstnd-io/dist/analysis/analysisActions';

type Props = {
  pairedMove: PairedMove;
  pairedIndex: number;
  startingLinearIndex: number;
  onFocus: (i: ChessHistoryIndex) => void;
  focusedIndex?: ChessHistoryIndex;
  className?: string;
  containerClassName?: string;
};

export const HistoryRow = React.forwardRef<HTMLDivElement | null, Props>(
  (
    {
      pairedMove,
      pairedIndex,
      startingLinearIndex,
      onFocus,
      className,
      focusedIndex,
      containerClassName,
    },
    ref
  ) => {
    const cls = useStyles();

    const moveCount = pairedIndex + 1;

    const [whiteMove, blackMove] = isPartialBlackMove(pairedMove)
      ? [undefined, pairedMove[0]] // if it's a partial black move treat it as a full move with white as undefined
      : pairedMove;

    const whiteMoveLinearIndex = startingLinearIndex;
    const blackMoveLinearIndex = whiteMoveLinearIndex + 1;

    const renderNestedContent = () => {
      const [
        focusedMoveIndex,
        focusedBranchIndex,
        focusedNestedIndex,
      ] = isChessRecursiveHistoryIndex(focusedIndex)
        ? focusedIndex
        : [focusedIndex, undefined, undefined];

      return (
        <>
          {whiteMove?.branchedHistories && (
            <>
              {whiteMove.branchedHistories.map((branchedHistory, branchIndex) => {
                const focusedIndexPerBranch =
                  focusedMoveIndex === whiteMoveLinearIndex && focusedBranchIndex === branchIndex
                    ? focusedNestedIndex
                    : undefined;

                return (
                  <HistoryList
                    key={`${whiteMove.san}-branch-${branchIndex}`}
                    history={branchedHistory}
                    onRefocus={(nestedIndex) =>
                      onFocus([whiteMoveLinearIndex, branchIndex, nestedIndex])
                    }
                    className={cls.nestedHistory}
                    rootPairedIndex={pairedIndex} // continue this move
                    focusedIndex={focusedIndexPerBranch}
                  />
                );
              })}
              {blackMove && (
                <div className={cx(cls.row, cls.rowBelowNested, className)}>
                  <Text className={cx(cls.text, cls.rowIndex)}>{`${moveCount}.`}</Text>
                  <Text className={cx(cls.text, cls.move, cls.blackMove)}>...</Text>
                  <Text
                    className={cx(cls.text, cls.move, cls.blackMove, {
                      [cls.activeMove]: blackMoveLinearIndex === focusedIndex,
                    })}
                    onClick={() => onFocus(blackMoveLinearIndex)}
                  >
                    {blackMove.san}
                  </Text>
                </div>
              )}
            </>
          )}
          {blackMove?.branchedHistories?.map((branchedHistory, branchIndex) => {
            const focusedIndexPerBranch =
              focusedMoveIndex === blackMoveLinearIndex && focusedBranchIndex === branchIndex
                ? focusedNestedIndex
                : undefined;

            return (
              <HistoryList
                history={branchedHistory}
                onRefocus={(nestedIndex) =>
                  onFocus([blackMoveLinearIndex, branchIndex, nestedIndex])
                }
                key={`${blackMove.san}-branch-${branchIndex}`}
                className={cls.nestedHistory}
                rootPairedIndex={pairedIndex + 1} // start a new move
                focusedIndex={focusedIndexPerBranch}
              />
            );
          })}
        </>
      );
    };

    return (
      <div className={cx(cls.container, containerClassName)} ref={ref}>
        <div className={cx(cls.row, className)}>
          <Text className={cx(cls.text, cls.rowIndex)}>{`${moveCount}.`}</Text>
          {whiteMove ? (
            <Text
              className={cx(cls.text, cls.move, cls.whiteMove, {
                [cls.activeMove]: whiteMoveLinearIndex === focusedIndex,
              })}
              onClick={() => onFocus(whiteMoveLinearIndex)}
            >
              {whiteMove.san}
            </Text>
          ) : (
            <Text className={cx(cls.text, cls.move, cls.whiteMove)}>...</Text>
          )}
          {blackMove && whiteMove?.branchedHistories ? (
            <Text className={cx(cls.text, cls.move, cls.blackMove)}>...</Text>
          ) : (
            <Text
              className={cx(cls.text, cls.move, cls.blackMove, {
                [cls.activeMove]: blackMoveLinearIndex === focusedIndex,
              })}
              onClick={() => onFocus(blackMoveLinearIndex)}
            >
              {blackMove?.san}
            </Text>
          )}
        </div>
        {renderNestedContent()}
      </div>
    );
  }
);

const borderColorsByDepth = [
  colors.primaryLightest,
  colors.positiveLight,
  colors.negativeLightest,
  colors.attentionLight,
];

const useStyles = createUseStyles({
  container: {
    // background: 'red',
    borderWidth: 0,
    borderBottomWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.neutralLighter,
    padding: `${spacers.small} ${spacers.small}`,
    ...({
      '&:first-child': {
        paddingTop: 0,
      },
      '&:last-child': {
        borderBottomWidth: 0,
      },
    } as CSSProperties),
  },
  row: {
    display: 'flex',
  },
  initStateRow: {
    flex: 1,
  },
  resultRow: {},
  text: {
    fontSize: '14px',
  },
  rowIndex: {
    paddingRight: spacers.default,
  },
  move: {
    cursor: 'pointer',
  },
  whiteMove: {
    flex: 1,
    fontWeight: 300,
  },
  blackMove: {
    flex: 1,
    fontWeight: 300,
  },
  filler: {
    flex: 1,
  },
  activeMove: {
    fontWeight: 800,
  },

  nestedHistory: {
    paddingTop: spacers.small,
    marginLeft: spacers.smallest,
    marginTop: spacers.smaller,
    borderLeft: `${spacers.smaller} solid ${colors.neutral}`,
    background: colors.neutralLightest,
    borderColor: borderColorsByDepth[3],
  },
  rowBelowNested: {
    marginTop: spacers.small,
  },
});
