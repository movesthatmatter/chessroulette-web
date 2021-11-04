import React from 'react';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { MobileLandingPage } from './MobileLandingPage';
import { DesktopLandingPage } from './DesktopLandingPage';

type Props = {};

export const LandingPage: React.FC<Props> = () => {
  const deviceSize = useDeviceSize();

  return deviceSize.isMobile ? <MobileLandingPage /> : <DesktopLandingPage />;
};

