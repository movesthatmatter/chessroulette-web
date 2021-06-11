import { useEffect } from 'react';

export const useBodyClass = (className: string[]) => {
  useEffect(() => {
    // Set up
    className.forEach((className: string) => document.body.classList.add(className));

    // Clean up
    return () => {
      className.forEach((className: string) => document.body.classList.remove(className));
    };
  }, [className]);
};
