import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { hideOnDesktop, hideOnMobile, onlyMobile, onlySmallMobile } from 'src/theme';
import { UserMenu } from './UserMenu';
import cx from 'classnames';

type Props = {
  logoAsLink?: boolean;
};

export const NavigationHeader: React.FC<Props> = ({
  logoAsLink = true,
}) => {
  const cls = useStyles();

  return (
    <>
    <div className={cls.top}>
      <div className={cx(cls.topMain, cls.onlyMobile)}>
        <Logo asLink={false} darkMode/>
        <UserMenu darkMode reversed/>
      </div>
      <div className={cx(cls.topMain, cls.onlyDesktop)}>
        <Logo asLink={logoAsLink}/>
      </div>
    </div>
    </>
  );
};

const topHeightPx = 60;

const useStyles = createUseStyles({
  container: {},
  top: {
    height: `${topHeightPx}px`,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',

    ...onlyMobile({
      height: 'auto',
      padding: '12px',
    }),

    ...onlySmallMobile({
      padding: '8px',
    }),
  },
  topMain: {
    flex: 1,

    ...onlyMobile({
      display: 'flex',
      alignContent: 'space-between',
    }),
  },
  onlyMobile: {
    ...hideOnDesktop,
  },
  onlyDesktop: {
    ...hideOnMobile,
  }
});
