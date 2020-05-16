import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';

export type AspectRatioProps = React.HTMLProps<HTMLDivElement> & {
  aspectRatio?: {
    width: number;
    height: number;
  };
} & ({
  width?: number;
  height?: never;
} | {
  height?: number;
  width?: never;
});

export const AspectRatio: React.FC<AspectRatioProps> = ({
  aspectRatio = {
    width: 16,
    height: 9,
  },
  ...props
}) => {
  const cls = useStyles();

  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        ...props.style,
      }}
      className={props.className}
    >
      <div
        className={cx(cls.container, props.className)}
        // style={{ paddingBottom: `${100 / (aspectRatio.width / aspectRatio.height)}%` }}
      >
        <div className={cls.content}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    height: '100%',
    //   position: 'absolute',
    top: 0,
    left: 0,
  },
});
