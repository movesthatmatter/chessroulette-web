import React, { useState } from 'react';
import { Dialog, DialogContentProps, DialogProps } from 'src/components/Dialog';
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

  return (
    <>
      <Dialog
        visible={isVisible}
        buttonsStacked
        {...restDialogProps}
        onClose={() => setIsVisible(false)}
        buttons={[
          {
            type: 'primary',
            ...props.cancelButtonProps,
            label: props.cancelButtonProps?.label || 'Cancel',
            onClick: () => setIsVisible(false),
          },
          {
            ...props.confirmButtonProps,
            label: props.confirmButtonProps?.label || 'Confirm',
            onClick: () => props.onConfirmed(),
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
