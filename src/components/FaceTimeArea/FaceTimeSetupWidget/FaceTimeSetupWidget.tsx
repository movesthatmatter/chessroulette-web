import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { isAVPermissionGranted } from 'src/services/AVStreaming';
import { FaceTimeSetup } from '../FaceTimeSetup/FaceTimeSetup';

type Props = {
  renderPermissionGranted: () => React.ReactNode;
  renderFallback?: () => React.ReactNode;
};

export const FaceTimeSetupWidget: React.FC<Props> = ({
  renderPermissionGranted = () => null,
  ...props
}) => {
  const [permissionsState, setPermissionsState] = useState<'none' | 'granted' | 'denied'>('none');

  useEffect(() => {
    isAVPermissionGranted().map((granted) => setPermissionsState(granted ? 'granted' : 'denied'));
  }, []);

  if (permissionsState === 'granted') {
    return (
      <>
        {renderPermissionGranted()}
      </>
    );
  }

  return (
    <>
      {props.renderFallback 
        ? props.renderFallback()
        : <FaceTimeSetup onUpdated={(s) => setPermissionsState(s.on ? 'granted' : 'denied')}/>
      }
    </>
  );
};
