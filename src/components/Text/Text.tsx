import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { fonts } from 'src/theme';
import cx from 'classnames';

export type TextProps = (JSX.IntrinsicElements['span'] & JSX.IntrinsicElements['p']) & {
  size?: 'small1' | 'small2' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'title1' | 'title2' | 'largeNormal' | 'largeBold';
  style?: CSSProperties;
  className?: string;
  asParagraph?: boolean;
  asLink?: boolean;
};

export const Text: React.FC<TextProps> = ({
  size = 'body1',
  className,
  asParagraph,
  asLink,
  ...props
}) => {
  const cls = useStyles();

  if (asParagraph) {
    return (
      <p {...props} className={cx(size && cls[size], asLink && cls.asLink, className)}>
        {props.children}
      </p>
    );
  }

  return (
    <span {...props} className={cx(size && cls[size], asLink && cls.asLink, className)}>
      {props.children}
    </span>
  );
};

const useStyles = createUseStyles({
  container: {},
  asLink: {
    cursor: 'pointer',
  },
  ...fonts,
});
