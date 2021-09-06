import { SimplePGN } from 'dstnd-io';
import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { MyGamesArchive } from './MyGamesArchive';
import cx from 'classnames';
import { PgnInputBox } from './PgnInputBox';
import { Button, IconButton } from 'src/components/Button';
import { FormPrevious } from 'grommet-icons';

type Props = {
  onImported: (pgn: SimplePGN) => void;
} & (
  | {
      hasBackButton?: false;
      onBackButtonClicked?: () => void;
    }
  | {
      hasBackButton: true;
      onBackButtonClicked: () => void;
    }
);

export const ImportPanel: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [pgn, setPgn] = useState<SimplePGN>();

  return (
    <>
      <LabeledFloatingBox
        label="Import a Previous Game"
        containerClassName={cx(cls.box, cls.gamesArchiveContainer)}
        floatingBoxClassName={cls.gamesArchive}
      >
        <div className={cls.scroller}>
          <div style={{ width: '100%' }}>
            <MyGamesArchive onSelect={(g) => setPgn(g.pgn as SimplePGN)} />
          </div>
        </div>
      </LabeledFloatingBox>
      <PgnInputBox
        // Here show either the pgn or if it's nothing the input
        value={pgn}
        onValidPgn={setPgn}
        onInvalidPgn={() => setPgn(undefined)}
        containerClassName={cx(cls.box, cls.pgnInputBox)}
        contentClassName={cls.pgnInputBox}
      />
      <div className={cx(cls.box, cls.buttonWrapper)}>
        {props.hasBackButton && (
          <IconButton
            type="secondary"
            icon={FormPrevious}
            onSubmit={() => props.onBackButtonClicked()}
            className={cls.button}
          />
        )}
        <Button
          label="Import"
          type="primary"
          disabled={!pgn}
          full
          onClick={() => {
            if (pgn) {
              props.onImported(pgn);
              setPgn(undefined);
            }
          }}
          containerClassName={cls.button}
          className={cls.noMarging}
        />
      </div>
    </>
  );
};

const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

const useStyles = createUseStyles({
  // TODO: Have a centralized box class since it's used in other places
  box: {
    paddingLeft: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingBottom: FLOATING_SHADOW_BOTTOM_OFFSET,
    marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,

    paddingTop: spacers.default,

    '&:first-child': {
      paddingTop: 0,
    },

    '&:last-child': {
      marginBottom: 0,
    },
  },
  gamesArchiveContainer: {
    overflowY: 'hidden',
  },
  gamesArchive: {
    overflowY: 'hidden',
  },
  fenBox: {
    flex: 0,
  },
  pgnBoxContainer: {
    maxHeight: '20%',
    overflowY: 'hidden',
  },
  pgnInputBox: {
    flex: 1,
  },
  scroller: {
    display: 'flex',
    flex: 1,
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    width: '100%',
    height: '100%',
  },
  button: {
    marginBottom: 0,
    marginLeft: spacers.small,

    '&:first-child': {
      marginLeft: 0,
    },
  },
  noMarging: {
    marginBottom: 0,
  },
  buttonWrapper: {
    display: 'flex',
  },
});
