import React, { useState } from 'react';
import { Dialog, DialogContentProps, DialogProps } from 'src/components/Dialog';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { Button, ButtonProps } from '../Button';

type Props = {
  dialogProps: DialogContentProps;
  buttonProps: Omit<ButtonProps, 'onClick'>;

  cancelButtonProps?: Partial<Omit<ButtonProps, 'onClick'>>;
  confirmButtonProps?: Partial<Omit<ButtonProps, 'onClick'>>;

  visible?: DialogProps['visible'];
  onConfirmed: () => void;
};

export const ConfirmButton: React.FC<Props> = ({ dialogProps, visible = false, ...props }) => {
  const [isVisible, setIsVisible] = useState(visible);
  const { buttons, ...restDialogProps } = dialogProps;
  const { theme } = useColorTheme();

  return (
    <>
      <Dialog
        visible={isVisible}
        buttonsStacked
        {...restDialogProps}
        onClose={() => setIsVisible(false)}
        buttons={[
          {
            type: theme.name === 'lightDefault' ? 'primary' : 'positive',
            ...props.cancelButtonProps,
            label: props.cancelButtonProps?.label || 'Cancel',
            onClick: () => setIsVisible(false),
          },
          {
            ...props.confirmButtonProps,
            label: props.confirmButtonProps?.label || 'Confirm',
            onClick: () => {
              props.onConfirmed();
              setIsVisible(false);
            },
          },
        ]}
      />
      <Button
        {...props.buttonProps}
        onClick={() => {
          setIsVisible(true);
        }}
      />
    </>
  );
};
