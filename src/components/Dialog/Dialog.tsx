import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { floatingShadow, floatingShadowDarkMode, onlyMobile, softBorderRadius } from 'src/theme';
import { DialogContent, DialogContentProps } from './DialogContent';
import cx from 'classnames';
import { noop } from 'src/lib/util';
import { Modal } from '../Modal/Modal';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';

export type DialogProps = {
  visible: boolean;
} & DialogContentProps;

export const Dialog: React.FC<DialogProps> = ({
  className,
  hasCloseButton = true,
  onClose = noop,
  ...props
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  if (!props.visible) {
    return null;
  }

  return (
    <Modal
      className={cls.layer}
      {...(hasCloseButton && {
        onClickOutside: onClose,
        onEsc: onClose,
      })}
    >
      <div
        className={cx(cls.container, className)}
        style={theme.name === 'lightDefault' ? floatingShadow : floatingShadowDarkMode}
      >
        <div className={cls.dialogContentWrapper}>
          <DialogContent
            className={cls.dialogContent}
            hasCloseButton={hasCloseButton}
            onClose={onClose}
            {...props}
          />
        </div>
      </div>
    </Modal>
  );
};

const useStyles = createUseStyles((theme) => ({
  layer: {
    minHeight: '100%',
    height: '100%',
    overflowY: 'scroll',
  },
  container: {
    minHeight: '100%',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
  },
  dialogContentWrapper: {
    ...makeImportant({
      ...softBorderRadius,
      minWidth: '200px',
      maxWidth: '360px',
      width: '50%',
      margin: '0 auto',
    }),

    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
      }),
    }),
  },
  dialogContent: {
    ...softBorderRadius,
    backgroundColor: theme.modal.background,
    marginTop: spacers.large,
    marginBottom: spacers.large,
  },
  verticalSpacer: {
    width: '100%',
    paddingBottom: '24px',
  },
}));
