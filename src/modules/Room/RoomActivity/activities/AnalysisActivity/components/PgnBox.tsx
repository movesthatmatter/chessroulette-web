import { SimplePGN } from 'dstnd-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { MiniClipboardCopyButton } from 'src/components/ClipboardCopy/MiniClipboardCopyButton';

type Props = {
  pgn: SimplePGN;
  containerClassName?: string;
  contentClassName?: string;
};

// Added a memo for now to optimize on the rerenders but this
//  is just a temporary patch until this is implemented:
// https://github.com/movesthatmatter/chessroulette-web/issues/149
export const PgnBox: React.FC<Props> = React.memo(({ pgn, ...props }) => {
  const cls = useStyles();

  return (
    <LabeledFloatingBox
      label="PGN"
      containerClassName={cx(props.containerClassName)}
      floatingBoxClassName={cx(cls.container, props.contentClassName)}
      topRightComponent={<MiniClipboardCopyButton value={pgn} />}
    >
      <div className={cls.scroller}>
        <div>
          <Text size="small1">{pgn || 'Wow So Empty!'}</Text>
        </div>
      </div>
    </LabeledFloatingBox>
  );
});

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
    flex: 1,
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
  },
});
