import React from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { Button, ButtonProps } from '../Button';
import cx from 'classnames';

type Props = {
  containerClassName?: string;
} & (
  | {
      overlayContent: React.ReactNode;
      overlayButtonProps?: undefined;
    }
  | {
      overlayContent?: undefined;
      overlayButtonProps: ButtonProps;
      oveerlayContentClassname?: string;
    }
);

export const Hoverable: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      {props.children}
      <div className={cls.overlay}>
        {props.overlayContent || (
          <div className={cls.overlayContent}>
            {/* TODO: This shouldn't have to be recasted. Maybe TS 4.5 will just work */}
            <Button {...(props.overlayButtonProps as ButtonProps)} />
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    ...({
      '&:hover $overlay': {
        display: 'flex',
      },
    } as NestedCSSElement),
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 0, 0, .2)',
    zIndex: 999,
    display: 'none',

    // ...hardBorderRadius,
    // overflow: 'hidden',
  },
  overlayContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
