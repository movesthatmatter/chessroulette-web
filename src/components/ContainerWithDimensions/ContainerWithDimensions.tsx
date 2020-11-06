import React, { useRef, useState, ReactElement, useEffect } from 'react';
import { debounce } from 'debounce';

type Props = React.HTMLProps<HTMLDivElement> & {
  render: (p: { width: number; height: number }) => ReactElement;
};

export const ContainerWithDimensions: React.FC<Props> = ({ render, ...props }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, updated: false });

  useEffect(() => {
    const onResizeHandler = () => {
      if (targetRef.current) {
        setDimensions({
          width: targetRef.current?.offsetWidth,
          height: targetRef.current?.offsetHeight,
          updated: true,
        });
      }
    };

    onResizeHandler();

    window.addEventListener('resize', debounce(onResizeHandler, 250));

    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, []);

  return (
    <div ref={targetRef} {...props}>
      {dimensions.updated &&
        render({
          width: dimensions.width,
          height: dimensions.height,
        })}
    </div>
  );
};
