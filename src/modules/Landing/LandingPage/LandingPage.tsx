import React from 'react';
import { MobileLandingPage } from './MobileLandingPage';
import { DesktopLandingPage } from './DesktopLandingPage';
import { createUseStyles } from 'src/lib/jss';
import { hideOnDesktop, hideOnMobile } from 'src/theme';

type Props = {};

export const LandingPage: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <>
      <div className={cls.mobileView}>
        <MobileLandingPage />
      </div>
      <div className={cls.desktopView}>
        <DesktopLandingPage />
      </div>
    </>
  );
};

const useStyles = createUseStyles({
  mobileView: {
    ...hideOnDesktop,
  },
  desktopView: {
    ...hideOnMobile,
  },
});
