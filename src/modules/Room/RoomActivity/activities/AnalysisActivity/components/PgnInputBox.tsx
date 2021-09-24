import { SimplePGN } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { getNewChessGame } from 'src/modules/Games/Chess/lib';
import useDebouncedEffect from 'use-debounced-effect';
import { TextArea } from 'src/components/TextArea';
import { Err, Ok, Result } from 'ts-results';

type Props = {
  onChange: (s: OnChangeState) => void;
  value?: string;
  containerClassName?: string;
  contentClassName?: string;
};

type OnChangeState =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      isValid: true;
      pgn: SimplePGN;
    }
  | {
      isLoading: false;
      isValid: false;
    };

const validatePGN = (s: string): Result<SimplePGN, 'PgnNotValidError'> => {
  const instance = getNewChessGame();
  const isValid = instance.load_pgn(s);

  return isValid ? new Ok(s as SimplePGN) : new Err('PgnNotValidError');
};

export const PgnInputBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [input, setInput] = useState(props.value || '');
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setInput((prev) => props.value || prev);
  }, [props.value]);

  useDebouncedEffect(
    () => {
      validatePGN(input)
        .map((pgn) => {
          setIsInvalid(false);
          props.onChange({
            isValid: true,
            isLoading: false,
            pgn,
          });
        })
        .mapErr(() => {
          setIsInvalid(true);
          props.onChange({
            isValid: false,
            isLoading: false,
          });
        });
    },
    250,
    [input]
  );

  useEffect(() => {
    if (input) {
      props.onChange({ isLoading: true });
    }
  }, [input]);

  return (
    <div className={props.containerClassName}>
      <div className={cx(cls.container, props.contentClassName)}>
        <TextArea
          label="Import PGN"
          value={input}
          className={cx(cls.container)}
          rows={5}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste PGN here"
          hasValidationError={isInvalid}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    marginBottom: 0,
  },
});
