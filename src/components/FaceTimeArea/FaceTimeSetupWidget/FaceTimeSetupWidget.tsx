import React, { useEffect, useRef, useState } from 'react';
import { getAVStreaming } from 'src/services/AVStreaming';
import { FaceTimeSetup } from '../FaceTimeSetup/FaceTimeSetup';

type Props = {
  renderPermissionGranted: () => React.ReactNode;
  renderFallback?: () => React.ReactNode;
};

export const FaceTimeSetupWidget: React.FC<Props> = ({
  renderPermissionGranted = () => null,
  ...props
}) => {
  const AVStreaming = useRef(getAVStreaming()).current;
  const [permissionsState, setPermissionsState] = useState<'none' | 'granted' | 'denied'>('none');

  useEffect(() => {
    AVStreaming.hasPermission().map((granted) => setPermissionsState(granted ? 'granted' : 'denied'));
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
