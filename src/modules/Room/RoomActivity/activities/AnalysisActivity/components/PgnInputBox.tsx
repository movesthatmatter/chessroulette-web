import { Err, Ok, Result, SimplePGN } from 'dstnd-io';
import React, { useCallback, useState } from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { getNewChessGame } from 'src/modules/Games/Chess/lib';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ClearIconButton } from 'src/components/Button/ClearIconButton';
import { debounce } from 'debounce';
import { colors, fonts, softBorderRadius, text } from 'src/theme';

type Props = {
  containerClassName?: string;
  contentClassName?: string;
  onImported: (pgn: SimplePGN) => void;
};

const validatePGN = (s: string): Result<SimplePGN, 'PgnNotValidError'> => {
  const instance = getNewChessGame();

  const isValid = instance.load_pgn(s);

  return isValid ? new Ok(instance.pgn() as SimplePGN) : new Err('PgnNotValidError');
};

export const PgnInputBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [pgnInput, setPgnInput] = useState<SimplePGN>();

  const validatePGNWithDebounce = useCallback(
    debounce((s: string) => {
      validatePGN(s)
        .map((pgn) => {
          setPgnInput(pgn);
        })
        .mapErr(() => setPgnInput(undefined));
    }, 250),
    []
  );

  return (
    <LabeledFloatingBox
      label="Import PGN"
      containerClassName={cx(props.containerClassName)}
      floatingBoxClassName={cx(cls.container, props.contentClassName)}
      topRightComponent={
        <ClearIconButton
          icon={faUpload}
          disabled={!pgnInput}
          title="Import"
          onClick={() => {
            if (pgnInput) {
              props.onImported(pgnInput);
              setPgnInput(undefined);
            }
          }}
        />
      }
    >
      <textarea
        className={cls.textArea}
        rows={5}
        placeholder="Paste PGN here"
        onChange={(e) => validatePGNWithDebounce(e.target.value)}
      />
    </LabeledFloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
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
  textArea: {
    border: 0,
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    ...fonts.body2,
    resize: 'none',
    fontFamily: 'Lato, Open Sans, sans-serif',

    ...({
      '&:focus-visible': {
        boxShadow: `0 0 0 2px ${colors.primaryLight}`,
        ...softBorderRadius,
        outline: 'none',
      },
    } as NestedCSSElement),
  },
  iconActive: {},
  iconInactive: {},
});
