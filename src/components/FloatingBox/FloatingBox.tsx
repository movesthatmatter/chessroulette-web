import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, floatingShadow, softBorderRadius, softOutline } from 'src/theme';
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

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    ...theme.flatingBox,
    ...softBorderRadius,
    padding: spacers.default,
  },
}));
