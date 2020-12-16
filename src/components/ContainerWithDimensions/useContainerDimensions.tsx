import React, { useEffect, useState } from 'react';
import { debounce } from 'debounce';

export type ContainerDimensions = {
  width: number;
  height: number;
  updated: boolean;
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useContainerDimensions(targetRef: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<ContainerDimensions>({ 
    width: 0,
    height: 0,
    updated: false,
  });

  useEffect(() => {
    const onResizeHandler = () => {
      if (targetRef.current) {
        setDimensions({
          width: targetRef.current.offsetWidth,
          height: targetRef.current.offsetHeight,
          updated: true,
        });
      }
    };

    onResizeHandler();

    window.addEventListener('resize', debounce(onResizeHandler, 250));

    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, [targetRef.current]);

  return dimensions;
}
