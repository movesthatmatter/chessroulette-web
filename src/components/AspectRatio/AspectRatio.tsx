import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';

export type AspectRatioExplicit = {
  width: number;
  height: number;
};

export type AspectRatioProps = React.HTMLProps<HTMLDivElement> & {
  aspectRatio?: AspectRatioExplicit | number;
} & ({
  width?: number | string;
  height?: never;
} | {
  height?: number;
  width?: never;
}) & {
  contentClassname?: string
};

export const AspectRatio: React.FC<AspectRatioProps> = ({
  aspectRatio = {
    width: 16,
    height: 9,
  },
  ...props
}) => {
  const cls = useStyles();

  const ratio = typeof aspectRatio === 'number' ? aspectRatio : aspectRatio.width / aspectRatio.height;

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
        className={cx(cls.inner)}
        style={{ paddingBottom: `${100 / ratio}%` }}
      >
        <div className={cx(cls.content, props.contentClassname)}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  inner: {
    width: '100%',
    position: 'relative',
  },
  content: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
