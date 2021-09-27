import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { CustomTheme } from 'src/theme';

type Props = React.HTMLProps<HTMLDivElement> & {};

export const FunWallpaper: React.FC<Props> = ({ className, children, ...contentDivProps }) => {
  const cls = useStyles();

  useBodyClass([cls.body]);

  return (
    <div className={cls.container}>
      <div className={cls.background}>
        <Mutunachi
          mid="5"
          className={cls.mutunachi}
          style={{
            top: '8%',
            left: '13%',
          }}
        />
        <Mutunachi
          mid="2"
          className={cls.mutunachi}
          style={{
            bottom: '5%',
            left: '7%',
          }}
        />
        <Mutunachi
          mid="8"
          className={cls.mutunachi}
          style={{
            right: '20%',
            transform: 'rotate(10deg)',
          }}
        />
        <Mutunachi
          mid="18"
          className={cls.mutunachi}
          style={{
            bottom: '15%',
            right: '11%',
          }}
        />
      </div>
      <div className={cx(cls.content, className)} {...contentDivProps}>
        {children}
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  body: {
    background: theme.colors.primaryLight,
  },
  container: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
    background: theme.colors.primaryLight,
  },
  mutunachi: {
    width: '200px',
    position: 'absolute',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacers.largest,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '1140px',
    margin: '0 auto',
    zIndex: 99,
  },
}));
