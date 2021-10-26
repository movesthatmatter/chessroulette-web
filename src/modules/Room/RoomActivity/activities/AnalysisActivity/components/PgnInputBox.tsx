import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { TextArea } from 'src/components/TextArea';

type Props = {
  onChange: (s: string) => void;
  value?: string;
  isInvalid?: boolean;
  containerClassName?: string;
  contentClassName?: string;
};

export const PgnInputBox: React.FC<Props> = ({ value = '', isInvalid = false, ...props }) => {
  const cls = useStyles();

  return (
    <div className={props.containerClassName}>
      <div className={cx(cls.container, props.contentClassName)}>
        <TextArea
          label="Import PGN"
          value={value}
          className={cx(cls.container)}
          rows={5}
          onChange={(e) => props.onChange(e.target.value)}
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
