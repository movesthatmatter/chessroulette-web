import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts } from 'src/theme';
import cx from 'classnames';

type Props = JSX.IntrinsicElements['span'] & {
  size?: 'small1' | 'small2';
};

export const Text: React.FC<Props> = ({
  size,
  className,
  ...props
}) => {
  const cls = useStyles();

  return (
    <span
      {...props}
      className={cx(
        size && cls[size],
        className,
      )}
    >{props.children}</span>
  );
};

const useStyles = createUseStyles({
  container: {},
  ...fonts,
});