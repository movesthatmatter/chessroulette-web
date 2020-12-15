import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { fonts } from 'src/theme';
import cx from 'classnames';

type Props = (JSX.IntrinsicElements['span'] & JSX.IntrinsicElements['p']) & {
  size?: 'small1' | 'small2' | 'body1' | 'body2';
  style?: CSSProperties;
  className?: string;
  asParagraph?: boolean;
};

export const Text: React.FC<Props> = ({ size, className, asParagraph, ...props }) => {
  const cls = useStyles();

  if (asParagraph) {
    return (
      <p {...props} className={cx(size && cls[size], className)}>
        {props.children}
      </p>
    );
  }

  return (
    <span {...props} className={cx(size && cls[size], className)}>
      {props.children}
    </span>
  );
};

const useStyles = createUseStyles({
  container: {},
  ...fonts,
});
