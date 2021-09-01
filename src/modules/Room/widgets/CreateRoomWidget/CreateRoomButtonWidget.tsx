import { CreateRoomRequest } from 'dstnd-io';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonProps } from 'src/components/Button';
import { toRoomUrlPath } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { CreateGameRoomWizard } from '../../wizards/CreateGameRoomWizard';
import { CreateAnalysisRoomWizard } from '../../wizards/CreateAnalysisRoomWizard';
import { Dialog } from 'src/components/Dialog';
import * as resources from '../../resources';
import { useLichessProvider } from 'src/modules/LichessPlay/LichessAPI/useLichessProvider';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activityType'>;
};

export const CreateRoomButtonWidget: React.FC<Props> = ({ createRoomSpecs, ...buttonProps }) => {
  const peerState = usePeerState();
  const history = useHistory();
  const [showWizard, setShowWizard] = useState(false);
  const lichess = useLichessProvider();

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
            {(createRoomSpecs.activityType === 'play' ||
              createRoomSpecs.activityType === 'lichess') && (
              <CreateGameRoomWizard
                type={createRoomSpecs.activityType}
                onFinished={({ gameSpecs }) => {
                  if (peerState.status !== 'open') {
                    return;
                  }

                  if (createRoomSpecs.activityType === 'lichess' && lichess){
                    lichess.initAndChallenge(gameSpecs);
                  }

                  resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: createRoomSpecs.type,
                      activityType: createRoomSpecs.activityType,
                      gameSpecs,
                    })
                    .map((room) => {
                      history.push(toRoomUrlPath(room));
                    });
                }}
              />
            )}
            {(createRoomSpecs.activityType === 'analysis' ||
              createRoomSpecs.activityType === 'none') && (
              <CreateAnalysisRoomWizard
                onFinished={() => {
                  if (peerState.status !== 'open') {
                    return;
                  }
                  resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: createRoomSpecs.type,
                      activityType:
                        createRoomSpecs.activityType === 'analysis' ? 'analysis' : 'none',
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
