import React, { useState } from 'react';
import { Dialog, DialogProps } from '../Dialog';

type RenderProps = {
  onOpen: () => void;
  onClose: () => void;
};

type DialogButtonProps = NonNullable<DialogProps['buttons']>[0];

export type WithDialogProps = Omit<DialogProps, 'visible' | 'buttons'> & {
  buttons: (DialogButtonProps | ((p: RenderProps) => DialogButtonProps))[];
  render: (p: RenderProps) => React.ReactNode;
};

export const WithDialog: React.FC<WithDialogProps> = ({
  hasCloseButton = false,
  buttons,
  render,
  ...dialogProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderProps = {
    onOpen: () => {
      setIsOpen(true);
    },
    onClose: () => setIsOpen(false),
  };

  return (
    <>
      <Dialog
        visible={isOpen}
        hasCloseButton={hasCloseButton}
        buttons={buttons.map((getButton) =>
          typeof getButton === 'function' ? getButton(renderProps) : getButton
        )}
        {...dialogProps}
      />
      {render(renderProps)}
    </>
  );
};
