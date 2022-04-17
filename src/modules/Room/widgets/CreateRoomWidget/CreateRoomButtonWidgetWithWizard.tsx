import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { Dialog } from 'src/components/Dialog';
import { CreateRoomWizard, CreateRoomWizardProps } from '../../wizards/CreateRoomWizard/CreateRoomWizard';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: CreateRoomWizardProps['createRoomSpecs'];
  onClick?: () => void;
};

export const CreateRoomButtonWidgetWithWizard: React.FC<Props> = ({
  createRoomSpecs,
  onClick = noop,
  ...buttonProps
}) => {
  const [showWizard, setShowWizard] = useState(false);
  const pc = usePeerConnection();

  return (
    <>
      <Button
        {...buttonProps}
        disabled={buttonProps.disabled || !pc.ready}
        onClick={() => {
          setShowWizard(true);
          onClick();
        }}
      />

      <Dialog
        visible={showWizard}
        content={
          <CreateRoomWizard
            createRoomSpecs={{
              p2pCommunicationType: 'audioVideo', // Default to audio video
              ...createRoomSpecs,
            }}
          />
        }
        onClose={() => setShowWizard(false)}
      />
    </>
  );
};
