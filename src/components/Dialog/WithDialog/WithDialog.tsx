import React, { useState } from 'react';
import { Dialog, DialogProps } from '../Dialog';

type RenderProps = {
  onOpen: () => void;
  onClose: () => void;
};

type DialogButtonProps = NonNullable<DialogProps['buttons']>[0];

export type WithDialogProps = Omit<DialogProps, 'visible' | 'buttons' | 'content'> & {
  buttons?: (DialogButtonProps | ((p: RenderProps) => DialogButtonProps))[];
  render: (p: RenderProps) => React.ReactNode;
  content: DialogProps['content'] | ((p: RenderProps) => React.ReactNode);
};

export const WithDialog: React.FC<WithDialogProps> = ({
  hasCloseButton = false,
  buttons,
  render,
  content,
  ...dialogProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderProps = {
    onOpen: () => {
      setIsOpen(true);
    },
    onClose: () => setIsOpen(false),
  };

  const contentComponent = typeof content === 'function' ? content(renderProps) : content;

  return (
    <>
      <Dialog
        visible={isOpen}
        hasCloseButton={hasCloseButton}
        buttons={buttons?.map((getButton) =>
          typeof getButton === 'function' ? getButton(renderProps) : getButton
        )}
        onClose={renderProps.onClose}
        content={contentComponent}
        {...dialogProps}
      />
      {render(renderProps)}
    </>
  );
};
