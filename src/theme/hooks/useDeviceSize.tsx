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

const areEqual = (current: DeviceSize, next: DeviceSize) =>
  current.isDesktop === next.isDesktop &&
  current.isMobile === next.isMobile &&
  current.isSmallMobile === next.isSmallMobile;

const getNext = (windowWidth: number): DeviceSize => {
  if (windowWidth < SMALL_MOBILE_BREAKPOINT) {
    return {
      ...allFalse,
      isSmallMobile: true,
      // Because a small mobile is still mobile
      isMobile: true,
    };
  } else if (windowWidth <= MOBILE_BREAKPOINT) {
    return {
      ...allFalse,
      isMobile: true,
    };
  } else {
    return {
      ...allFalse,
      isDesktop: true,
    };
  }
};

export const useDeviceSize = (): DeviceSize => {
  const windowWidth = useWindowWidth();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>(allFalse);

  useEffect(() => {
    setDeviceSize((prev) => {
      const next = getNext(windowWidth);

      return areEqual(prev, next) ? prev : next;
    });
  }, [windowWidth]);

  return deviceSize;
};
