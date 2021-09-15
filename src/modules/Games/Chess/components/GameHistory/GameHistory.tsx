import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { colors, softBorderRadius } from 'src/theme';
import { debounce } from 'debounce';
import { HistoryList, HistoryListProps } from './components/HistoryList';
import { ChessRecursiveHistory } from 'dstnd-io';

export type GameHistoryProps = {
  history: ChessRecursiveHistory;
  focusedIndex: HistoryListProps['focusedIndex'];
  onRefocus: HistoryListProps['onRefocus'];

  className?: string;
  containerClassName?: string;

  // @deprecated
  showRows?: number;
};

export const GameHistory: React.FC<GameHistoryProps> = ({
  history = [],

  showRows = 4,
  focusedIndex,
  onRefocus,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cx(cls.main, props.className)}>
        {/* <div className={cls.spacer} /> */}
        <HistoryList
          history={history}
          focusedIndex={focusedIndex}
          onRefocus={onRefocus}
          className={cls.content}
          rowClassName={cls.row}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100%',
  },
  main: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    flex: 1,
  },
  spacer: {
    height: spacers.default,
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowY: 'auto',
  },
  row: {
    '&:last-child': {
      paddingBottom: 0,
    }
  },
});
