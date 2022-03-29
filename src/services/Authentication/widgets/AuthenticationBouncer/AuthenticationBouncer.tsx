import React, { useCallback, useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { AuthenticationState } from '../../reducer';
import { useAuthentication } from '../../useAuthentication';
import { AuthenticationDialog } from '../AuthenticationDialog';

type Props = {
  render: (p: { check: () => void }) => React.ReactNode;
  onAuthenticated?: (auth: AuthenticationState) => void;
};

export const AuthenticationBouncer: React.FC<Props> = ({ render, onAuthenticated = noop }) => {
  const auth = useAuthentication();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogUniqKey, setDialogUniqKey] = useState(String(Math.random()));
  const [checkCalled, setCheckCalled] = useState(false);

  const check = useCallback(() => {
    setCheckCalled(true);

    if (auth.authenticationType === 'user') {
      return;
    }

    setDialogUniqKey(String(Math.random()));
    setShowDialog(true);
  }, [auth.authenticationType, onAuthenticated]);

  useEffect(() => {
    if (checkCalled && auth.authenticationType === 'user') {
      onAuthenticated(auth);
      setCheckCalled(false);
      setShowDialog(false);
    }
  }, [checkCalled, auth.authenticationType]);

  return (
    <>
      <AuthenticationDialog
        key={dialogUniqKey}
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
      {render({ check })}
    </>
  );
};
