import { CreateRoomRequest } from 'dstnd-io';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonProps } from 'src/components/Button';
import { noop, toRoomUrlPath } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { CreatePlayRoomWizard } from '../../wizards/CreatePlayRoomWizard';
import { CreateAnalysisRoomWizard } from '../../wizards/CreateAnalysisRoomWizard';
import { Dialog } from 'src/components/Dialog';
import * as resources from '../../resources';
import { AsyncOk } from 'ts-async-results';
import { UnknownAsyncResult } from 'src/lib/types';
import { Events } from 'src/services/Analytics';
import { CreateRelayRoomWizard } from '../../wizards/CreateRelayRoomWizard';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activityType'>;
  onClick?: () => void;
};

export const CreateRoomButtonWidget: React.FC<Props> = ({
  createRoomSpecs,
  onClick = noop,
  ...buttonProps
}) => {
  const peerState = usePeerState();
  const history = useHistory();
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
          <>
            {createRoomSpecs.activityType === 'play' && (
              <CreatePlayRoomWizard
                onFinished={({ gameSpecs }) => {
                  if (peerState.status !== 'open') {
                    return AsyncOk.EMPTY;
                  }

                  return (resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: createRoomSpecs.type,
                      activityType: 'play',
                      gameSpecs: {...gameSpecs, gameType: 'chess'},
                    })
                    .map((room) => {
                      Events.trackRoomCreated(room);
                      history.push(toRoomUrlPath(room));
                    }) as unknown) as UnknownAsyncResult;
                }}
              />
            )}
             {createRoomSpecs.activityType === 'warGame' && (
              <CreatePlayRoomWizard
                onFinished={({ gameSpecs }) => {
                  if (peerState.status !== 'open') {
                    return AsyncOk.EMPTY;
                  }

                  return (resources
                    .createRoom({
                      userId: peerState.me.id,
                      type: createRoomSpecs.type,
                      activityType: 'warGame',
                      gameSpecs: {...gameSpecs, gameType: 'warGame'},
                    })
                    .map((room) => {
                      Events.trackRoomCreated(room);
                      history.push(toRoomUrlPath(room));
                    }) as unknown) as UnknownAsyncResult;
                }}
              />
            )}
            {createRoomSpecs.activityType === 'analysis' && (
              <CreateAnalysisRoomWizard
                onFinished={() => {
                  if (peerState.status !== 'open') {
                    return AsyncOk.EMPTY;
                  }

                  return (resources
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
                      Events.trackRoomCreated(room);
                      history.push(toRoomUrlPath(room));
                    }) as unknown) as UnknownAsyncResult;
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
