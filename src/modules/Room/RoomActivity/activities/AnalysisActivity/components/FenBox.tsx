import { ChessHistory, SimplePGN } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { Text } from 'src/components/Text';
import { pgnToFen } from 'src/modules/Games/Chess/lib';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { MiniClipboardCopyButton } from 'src/components/ClipboardCopy/MiniClipboardCopyButton';

type Props = {
  historyOrPgn: ChessHistory | SimplePGN;
  containerClassName?: string;
};

const toFen = (pgnOrHistory: ChessHistory | SimplePGN): string => {
  if (typeof pgnOrHistory === 'string') {
    return pgnToFen(pgnOrHistory);
  }

  return pgnToFen(chessHistoryToSimplePgn(pgnOrHistory));
};

export const FenBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [fen, setFen] = useState(toFen(props.historyOrPgn));

  useEffect(() => {
    setFen(toFen(props.historyOrPgn));
  }, [props.historyOrPgn]);

  return (
    <LabeledFloatingBox
      label="FEN"
      containerClassName={props.containerClassName}
      topRightComponent={<MiniClipboardCopyButton value={fen} />}
    >
      <Text size="small1" className={cls.fenText}>
        {fen}
      </Text>
    </LabeledFloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {
    overflow: 'hidden',
  },
  fenText: {
    overflowWrap: 'anywhere',
    wordBreak: 'break-all',
  },
  top: {
    display: 'flex',
  },
});
