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
      setDimensions((prev) => {
        if (!targetRef.current) {
          return prev;
        }

        const next = {
          width: targetRef.current.offsetWidth,
          height: targetRef.current.offsetHeight,
          updated: true,
        };

        // If nothing changed return prev!
        if (prev.height === next.height && prev.width === next.width && next.updated === true) {
          return prev;
        }

        return next;
      });
    };

    onResizeHandler();

    window.addEventListener('resize', debounce(onResizeHandler, 250));

    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, [targetRef.current]);

  return dimensions;
}