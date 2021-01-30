import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { AuthenticationDialog } from '../AuthenticationDialog';


type Props = {};

export const AuthenticationButton: React.FC<Props> = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogUniqKey, setDialogUniqKey] = useState(String(Math.random()));

  return (
    <>
      <Button
        label="My Account"
        clear
        type="primary"
        onClick={() => {
          setDialogUniqKey(String(Math.random()));
          setShowDialog(true);
        }}
        style={{
          marginBottom: 0,
        }}
      />
      <AuthenticationDialog key={dialogUniqKey} visible={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
};
