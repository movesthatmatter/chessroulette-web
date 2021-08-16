import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { PairedMove } from '../../../lib';
import cx from 'classnames';
import { HistoryList } from './HistoryList';
import { colors } from 'src/theme';
import {
  ChessHistoryIndex,
  getNestedChessHistoryIndex,
  isBranchedHistoryIndex,
} from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';

type Props = {
  pairedMove: PairedMove;
  pairedIndex: number;
  whiteMoveLinearIndex: number;
  isActive: 'white' | 'black' | undefined;
  onFocus: (i: ChessHistoryIndex) => void;
  focusedIndex?: ChessHistoryIndex;
  className?: string;
};

export const HistoryRow: React.FC<Props> = ({
  pairedMove,
  pairedIndex,
  whiteMoveLinearIndex,
  onFocus,
  className,
  focusedIndex,
}) => {
  const cls = useStyles();
  const moveCount = pairedIndex + 1;
  const [whiteMove, blackMove] = pairedMove;
  const blackMoveLinearIndex = whiteMoveLinearIndex + 1;

  return (
    <div className={cls.container}>
      <div
        className={cx(cls.row, className)}
        // ref={(b) => (rowElementRefs.current[index] = b)}
      >
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

        {blackMove && (
          <>
            {whiteMove?.branchedHistories ? (
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
          </>
        )}
      </div>
      {whiteMove?.branchedHistories && (
        <>
          {whiteMove.branchedHistories.map((branchedHistory, branchIndex) => {
            const focusedIndexPerBranch =
              isBranchedHistoryIndex(focusedIndex) &&
              focusedIndex[0] === whiteMoveLinearIndex &&
              focusedIndex[1] === branchIndex
                ? getNestedChessHistoryIndex(focusedIndex)
                : undefined;

            return (
              <HistoryList
                history={branchedHistory}
                onRefocus={(nestedIndex) => {
                  onFocus([whiteMoveLinearIndex, branchIndex, nestedIndex]);
                }}
                key={`${whiteMove.san}-branch-${branchIndex}`}
                className={cls.nestedHistory}
                rootPairedIndex={pairedIndex + 1}
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
          isBranchedHistoryIndex(focusedIndex) &&
          focusedIndex[0] === blackMoveLinearIndex &&
          focusedIndex[1] === branchIndex
            ? getNestedChessHistoryIndex(focusedIndex)
            : undefined;

        return (
          <HistoryList
            history={branchedHistory}
            onRefocus={(nestedIndex) => {
              onFocus([blackMoveLinearIndex, branchIndex, nestedIndex]);
            }}
            key={`${blackMove.san}-branch-${branchIndex}`}
            className={cls.nestedHistory}
            rootPairedIndex={pairedIndex + 1}
            focusedIndex={focusedIndexPerBranch}
          />
        );
      })}
    </div>
  );
};

const borderColorsByDepth = [
  colors.primaryLightest,
  colors.positiveLight,
  colors.negativeLightest,
  colors.attentionLight,
];

const useStyles = createUseStyles({
  container: {
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
