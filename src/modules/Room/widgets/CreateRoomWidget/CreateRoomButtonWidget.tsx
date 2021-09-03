import { CreateRoomRequest } from 'dstnd-io';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonProps } from 'src/components/Button';
import { toRoomUrlPath } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { CreatePlayRoomWizard } from '../../wizards/CreatePlayRoomWizard';
import { CreateAnalysisRoomWizard } from '../../wizards/CreateAnalysisRoomWizard';
import { Dialog } from 'src/components/Dialog';
import * as resources from '../../resources';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activityType'>;
};

export const CreateRoomButtonWidget: React.FC<Props> = ({ createRoomSpecs, ...buttonProps }) => {
  const peerState = usePeerState();
  const history = useHistory();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <Button
        {...buttonProps}
        disabled={buttonProps.disabled || peerState.status !== 'open'}
        onClick={() => setShowWizard(true)}
      />

      <Dialog
        visible={showWizard}
        content={
          <>
            {createRoomSpecs.activityType === 'play' && (
              <CreatePlayRoomWizard
                onFinished={({ gameSpecs }) => {
                  if (peerState.status !== 'open') {
                    return;
                  }

                  resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: createRoomSpecs.type,
                      activityType: 'play',
                      gameSpecs,
                    })
                    .map((room) => {
                      history.push(toRoomUrlPath(room));
                    });
                }}
              />
            )}
            {createRoomSpecs.activityType !== 'play' && (
              <CreateAnalysisRoomWizard
                onFinished={() => {
                  if (peerState.status !== 'open') {
                    return;
                  }

                  resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: createRoomSpecs.type,
                      ...(createRoomSpecs.activityType === 'analysis'
                        ? {
                            activityType: 'analysis',
                            history: [],
                          }
                        : {
                            activityType: 'none',
                          }),
                    })
                    .map((room) => {
                      history.push(toRoomUrlPath(room));
                    });
                }}
              />
            )}
          </>
        }
        onClose={() => setShowWizard(false)}
      />
    </>
  );
};
