import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, effects, floatingShadow, softBorderRadius, } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';

export type FloatingBoxProps = React.HTMLProps<HTMLDivElement> & {};

export const FloatingBox: React.FC<FloatingBoxProps> = ({ children, className, ...divProps }) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, className)} {...divProps}>
      {children}
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    ...(theme.name === 'lightDefault' ? {
      backgroundColor: theme.colors.white,
    ...effects.softOutline,
    ...floatingShadow,
    }: {
      backgroundColor: '#21212B',
    }),
    ...softBorderRadius,
    padding: spacers.default,
  },
}));
