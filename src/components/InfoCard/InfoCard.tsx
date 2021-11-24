import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { hardBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { FloatingBox } from '../FloatingBox';

type Props = {
  top: React.ReactNode;
  bottom: React.ReactNode;

  containerClassName?: string;
  topClassName?: string;
  bottomClassName?: string;
};

export const InfoCard: React.FC<Props> = ({
  top,
  bottom,
  containerClassName,
  topClassName,
  bottomClassName,
}) => {
  const cls = useStyles();

  return (
    <FloatingBox className={cx(cls.container, containerClassName)}>
      <div className={cx(cls.top, topClassName)}>{top}</div>
      <div className={cx(cls.bottom, bottomClassName)}>{bottom}</div>
    </FloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    ...hardBorderRadius,
    overflow: 'hidden',
  },
  top: {},
  bottom: {
    borderTop: `1px solid rgba(255, 255, 255, .1)`,
    padding: spacers.default,
  },
});
