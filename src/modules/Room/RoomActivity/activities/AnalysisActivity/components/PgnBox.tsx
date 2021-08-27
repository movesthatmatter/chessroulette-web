import { ChessHistory, isSimplePGN, SimplePGN } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { LabeledFloatingBox } from './LabeledFloatingBox';

type Props = {
  historyOrPgn: ChessHistory | SimplePGN;
  containerClassName?: string;
  contentClassName?: string;
};

const toPgn = (pgnOrHistory: ChessHistory | SimplePGN): SimplePGN => {
  if (typeof pgnOrHistory === 'string') {
    return pgnOrHistory;
  }

  return chessHistoryToSimplePgn(pgnOrHistory);
};

export const PgnBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [pgn, setPgn] = useState(toPgn(props.historyOrPgn));

  useEffect(() => {
    setPgn(toPgn(props.historyOrPgn));
  }, [props.historyOrPgn]);

  return (
    <LabeledFloatingBox
      label="PGN"
      containerClassName={cx(props.containerClassName)}
      floatingBoxClassName={cx(cls.container, props.contentClassName)}
    >
      <div className={cls.scroller}>
        <div>
          <Text size="small1">{pgn}</Text>
        </div>
      </div>
    </LabeledFloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  top: {
    padding: spacers.smaller,
  },
  scroller: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
  },
});
