import { ChessGameStateFen } from 'chessroulette-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Text } from 'src/components/Text';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { MiniClipboardCopyButton } from 'src/components/ClipboardCopy/MiniClipboardCopyButton';

type Props = {
  fen: ChessGameStateFen;
  containerClassName?: string;
};

// Added a memo for now to optimize on the rerenders but this
//  is just a temporary patch until this is implemented:
// https://github.com/movesthatmatter/chessroulette-web/issues/149
export const FenBox: React.FC<Props> = React.memo(({ fen, ...props }) => {
  const cls = useStyles();

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
});

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
