import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { AuthenticationDialog } from '../AuthenticationDialog';

type Props = Omit<ButtonProps, 'onClick' | 'click' | 'type' | 'label'> & {
  label?: string;
};

export const AuthenticationButton: React.FC<Props> = ({
  label = 'My Account',
  ...restButtonProps
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogUniqKey, setDialogUniqKey] = useState(String(Math.random()));

  return (
    <>
      <Button
        label={label}
        clear
        type="primary"
        onClick={() => {
          setDialogUniqKey(String(Math.random()));
          setShowDialog(true);
        }}
        style={{
          marginBottom: 0,
        }}
        withBadge={{
          color: 'negative',
          text: 'New',
        }}
        {...restButtonProps}
      />
      <AuthenticationDialog
        key={dialogUniqKey}
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};
