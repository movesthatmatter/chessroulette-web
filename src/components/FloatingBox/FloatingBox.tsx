import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { effects, softBorderRadius } from 'src/theme';
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

const useStyles = createUseStyles((theme) => ({
  container: {
    backgroundColor: theme.depthBackground.backgroundColor,
    ...(theme.name === 'lightDefault'
      ? {
          ...effects.softOutline,
          ...effects.floatingShadow,
        }
      : {
          ...effects.softFloatingShadowDarkMode,
        }),
    ...softBorderRadius,
    padding: spacers.default,
  },
}));
