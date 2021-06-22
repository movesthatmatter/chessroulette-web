import { useWindowWidth } from '@react-hook/window-size';
import { MOBILE_BREAKPOINT, SMALL_MOBILE_BREAKPOINT } from '../mediaQueries';

const allFalse = {
  isSmallMobile: false,
  isMobile: false,
  // isTablet: false,
  isDesktop: false,
};

export const useDeviceSize = () => {
  const windowWidth = useWindowWidth();

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
  }

  // Add Tablet

  return {
    ...allFalse,
    isDesktop: true,
  };
};
