import React, { useState } from 'react';
import { CreateRoomRequest } from 'dstnd-io';
import { Button, ButtonProps } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { Dialog } from 'src/components/Dialog';
import { CreateRoomWizard } from '../../wizards/CreateRoomWizard/CreateRoomWizard';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activityType' | 'p2pCommunicationType'>;
  onClick?: () => void;
};

export const CreateRoomButtonWidget: React.FC<Props> = ({
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
