import { Layer, LayerProps } from 'grommet';
import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { DialogContent, DialogContentProps } from './DialogContent';
import cx from 'classnames';
import { noop } from 'src/lib/util';

export type DialogProps = {
  visible: boolean;
  target?: LayerProps['target'];
} & DialogContentProps;

export const Dialog: React.FC<DialogProps> = ({
  className,
  hasCloseButton = true,
  onClose = noop,
  ...props
}) => {
  const cls = useStyles();

  if (!props.visible) {
    return null;
  }

  return (
    <Layer
      className={cx(cls.container, className)}
      position="center"
      // Note: Took the animation out because during the transition it renders
      //  the content weirdly!
      animation={false}
      target={props.target}
      modal
      responsive={false}
      {...(hasCloseButton && {
        onClickOutside: onClose,
        onEsc: onClose,
      })}
    >
      <DialogContent hasCloseButton={hasCloseButton} onClose={onClose} {...props} />
    </Layer>
  );
};

const useStyles = createUseStyles({
  container: {
    ...floatingShadow,
    ...softBorderRadius,
    padding: 0,
    position: 'relative',

    ...makeImportant({
      borderRadius: '8px',
      minWidth: '200px',
      maxWidth: '360px',
      width: '50%',
    }),

    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
      }),
    }),
  },
});
