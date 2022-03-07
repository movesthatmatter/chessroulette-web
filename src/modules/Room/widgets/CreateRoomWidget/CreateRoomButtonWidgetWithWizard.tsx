import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { Dialog } from 'src/components/Dialog';
import { CreateRoomWizard, CreateRoomWizardProps } from '../../wizards/CreateRoomWizard/CreateRoomWizard';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: CreateRoomWizardProps['createRoomSpecs'];
  onClick?: () => void;
};

export const CreateRoomButtonWidgetWithWizard: React.FC<Props> = ({
  createRoomSpecs,
  onClick = noop,
  ...buttonProps
}) => {
  const peerState = usePeerState();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <Button
        {...buttonProps}
        disabled={buttonProps.disabled || peerState.status !== 'open'}
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
