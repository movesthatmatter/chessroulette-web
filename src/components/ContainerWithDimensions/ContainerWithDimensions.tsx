import React, {
  useRef, useLayoutEffect, useState, ReactElement,
} from 'react';
import { HtmlAttributes } from 'csstype';

type Props = React.HTMLProps<HTMLDivElement> & {
  render: (p: {width: number; height: number}) => ReactElement;
}

export const ContainerWithDimensions: React.FC<Props> = ({ render, ...props }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, updated: false });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current?.offsetWidth,
        height: targetRef.current?.offsetHeight,
        updated: true,
      });
    }
  }, []);

  return (
    <div ref={targetRef} {...props}>
      {dimensions.updated && render({
        width: dimensions.width,
        height: dimensions.height,
      })}
    </div>
  );
};
