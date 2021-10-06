import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import {
  CustomTheme,
  floatingShadow,
  floatingShadowDarkMode,
  onlyMobile,
  softBorderRadius,
} from 'src/theme';
import { DialogContent, DialogContentProps } from './DialogContent';
import cx from 'classnames';
import { noop } from 'src/lib/util';
import { Modal } from '../Modal/Modal';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { Layer, LayerProps } from 'grommet';

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
  const { themeName } = useColorTheme();

  if (!props.visible) {
    return null;
  }

  return (
    <Modal
      className={cx(cls.container, className)}
      {...(hasCloseButton && {
        onClickOutside: onClose,
        onEsc: onClose,
      })}
      style={themeName === 'light' ? floatingShadow : floatingShadowDarkMode}

    >
      <DialogContent className={cls.background} hasCloseButton={hasCloseButton} onClose={onClose} {...props} />
    </Modal>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    backgroundColor: theme.modal.background,
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
  background: {
    borderRadius: '8px !important',
    backgroundColor: theme.modal.background,
  },
}));
