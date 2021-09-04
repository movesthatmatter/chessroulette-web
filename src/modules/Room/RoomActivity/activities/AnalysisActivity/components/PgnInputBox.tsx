import { Err, Ok, Result, SimplePGN } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { getNewChessGame } from 'src/modules/Games/Chess/lib';
import { colors, fonts, softBorderRadius } from 'src/theme';
import useDebouncedEffect from 'use-debounced-effect';

type Props = {
  value?: string;
  onValidPgn: (s: SimplePGN) => void;
  onInvalidPgn: () => void;
  containerClassName?: string;
  contentClassName?: string;
};

const validatePGN = (s: string): Result<SimplePGN, 'PgnNotValidError'> => {
  const instance = getNewChessGame();

  const isValid = instance.load_pgn(s);

  return isValid ? new Ok(s as SimplePGN) : new Err('PgnNotValidError');
};

export const PgnInputBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [input, setInput] = useState(props.value || '');

  useEffect(() => {
    setInput((prev) => props.value || prev);
  }, [props.value]);

  useDebouncedEffect(
    () => {
      validatePGN(input).map(props.onValidPgn).mapErr(props.onInvalidPgn);
    },
    250,
    [input]
  );

  return (
    <LabeledFloatingBox
      label="Import PGN"
      containerClassName={cx(props.containerClassName)}
      floatingBoxClassName={cx(cls.container, props.contentClassName)}
    >
      <textarea
        value={input}
        className={cls.textArea}
        rows={5}
        placeholder="Paste PGN here"
        // onChange={(e) => props.onChange(e.target.value)}
        onChange={(e) => setInput(e.target.value)}
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
