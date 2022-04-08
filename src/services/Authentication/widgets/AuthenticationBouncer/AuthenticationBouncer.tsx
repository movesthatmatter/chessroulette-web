import React, { useCallback, useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { AuthenticationStateUser } from '../../reducer';
import { useAuthentication } from '../../useAuthentication';
import { AuthenticationDialog } from '../AuthenticationDialog';

type Props = {
  onAuthenticated?: (auth: AuthenticationStateUser) => void;
  render?: (auth: AuthenticationStateUser) => React.ReactNode;
  renderFallback?: (p: { check: () => void }) => React.ReactNode;
};

export const AuthenticationBouncer: React.FC<Props> = ({
  render = () => null,
  renderFallback = () => null,
  onAuthenticated = noop,
}) => {
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

  if (auth.authenticationType === 'user') {
    return <>{render(auth)}</>;
  }

  return (
    <>
      <AuthenticationDialog
        key={dialogUniqKey}
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
      {renderFallback({ check })}
    </>
  );
};
