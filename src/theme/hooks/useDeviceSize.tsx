import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import { MOBILE_BREAKPOINT, SMALL_MOBILE_BREAKPOINT } from '../mediaQueries';

export type DeviceSize = {
  isSmallMobile: boolean;
  isMobile: boolean;
  isDesktop: boolean;
};

const allFalse: DeviceSize = {
  isSmallMobile: false,
  isMobile: false,
  // isTablet: false,
  isDesktop: false,
};

export const useDeviceSize = (): DeviceSize => {
  const windowWidth = useWindowWidth();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>(allFalse);

  useEffect(() => {
    if (windowWidth < SMALL_MOBILE_BREAKPOINT) {
      setDeviceSize({
        ...allFalse,
        isSmallMobile: true,
        // Because a small mobile is still mobile
        isMobile: true,
      });
    } else if (windowWidth <= MOBILE_BREAKPOINT) {
      setDeviceSize({
        ...allFalse,
        isMobile: true,
      });
    } else {
      setDeviceSize({
        ...allFalse,
        isDesktop: true,
      });
    }
  }, [windowWidth]);

  return deviceSize;
};
