import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { PairedMove } from '../../../lib';
import cx from 'classnames';
import { ChessGameColor } from 'dstnd-io';
import { HistoryList } from './HistoryList';
import { colors } from 'src/theme';

type Props = {
  pairedMove: PairedMove;
  index: number;
  isActive: 'white' | 'black' | undefined;
  onClick: (color: ChessGameColor) => void;
  className?: string;
};

export const HistoryRow: React.FC<Props> = ({
  pairedMove,
  index: rootIndex,
  isActive,
  onClick,
  className,
}) => {
  const cls = useStyles();
  const moveCount = rootIndex + 1;

  const [whiteMove, blackMove] = pairedMove;

  return (
    <div className={cls.container}>
      <div
        className={cx(cls.row, className)}
        // ref={(b) => (rowElementRefs.current[index] = b)}
      >
        <Text className={cx(cls.text, cls.rowIndex)}>{`${moveCount}.`}</Text>
        <Text
          className={cx(cls.text, cls.move, cls.whiteMove, {
            [cls.activeMove]: isActive === 'white',
          })}
          onClick={() => onClick('white')}
        >
          {whiteMove?.san || '...'}
        </Text>
        {whiteMove?.branchedHistories && blackMove ? (
          <Text className={cx(cls.text, cls.move, cls.blackMove)}>...</Text>
        ) : (
          <Text
            className={cx(cls.text, cls.move, cls.blackMove, {
              [cls.activeMove]: isActive === 'black',
            })}
            onClick={() => onClick('black')}
          >
            {blackMove?.san}
          </Text>
        )}
      </div>
      {whiteMove?.branchedHistories && (
        <>
          {whiteMove.branchedHistories.map((branchedHistory, index) => (
            <HistoryList
              history={branchedHistory}
              onRefocus={() => {}}
              key={`${whiteMove.san}-branch-${index}`}
              className={cls.nestedHistory}
              rootIndex={rootIndex}
            />
          ))}

          <div className={cx(cls.row, className)}>
            <Text className={cx(cls.text, cls.rowIndex)}>{`${moveCount}.`}</Text>
            <Text className={cx(cls.text, cls.move, cls.blackMove)}>...</Text>
            <Text
              className={cx(cls.text, cls.move, cls.blackMove, {
                [cls.activeMove]: isActive === 'black',
              })}
              onClick={() => onClick('black')}
            >
              {blackMove?.san}
            </Text>
          </div>
        </>
      )}
      {blackMove?.branchedHistories &&
        blackMove.branchedHistories.map((branchedHistory, index) => (
          <HistoryList
            history={branchedHistory}
            onRefocus={() => {}}
            key={`${blackMove.san}-branch-${index}`}
            className={cls.nestedHistory}
            rootIndex={rootIndex}
          />
        ))}
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
        // paddingBottom: 0,
        borderBottomWidth: 0,
      },
    } as CSSProperties),
  },
  row: {
    // background: 'red',

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
    borderLeft: `${spacers.smaller} solid ${colors.neutral}`,
    background: colors.neutralLighter,
    borderColor: borderColorsByDepth[3],
    // background: `rgba(230, 236, 245, .5)`,
  },
});
