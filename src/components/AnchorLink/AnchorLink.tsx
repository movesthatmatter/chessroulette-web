import { Colors } from 'grommet/themes/base';
import React from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { colors, text } from 'src/theme';
import { HTMLAnchorElement } from 'window-or-global';

type Props = React.HTMLProps<HTMLAnchorElement> & {
  baseColor?: string;
  hoverColor?: string;
  visitedColor?: string;
};

export const AnchorLink: React.FC<Props> = ({
  className,
  baseColor,
  hoverColor,
  visitedColor,
  ...props
}) => {
  const cls = useStyles();

  return (
    <a
      {...props}
      className={`${className} ${cls.container}`}
      style={{
        color: baseColor,
      }}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    textDecoration: 'none',
    fontFamily: 'Lato, Open Sans, sans serif',
    color: colors.primary,

    ...({
      '&:visited': {
        color: colors.primaryDark,
      },
    } as NestedCSSElement),
    '&:hover': {
      // borderBottom: `3px solid ${text.primaryColor}`,
      color: colors.primaryHover,
    },
  },
});
