import { AsyncResult, RoomRecord } from 'dstnd-io';
import React from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { resources } from 'src/resources';
import { Events } from 'src/services/Analytics';
import {
  PendingChallengeContainer,
  PendingChallengeContainerProps,
} from './PendingChallengeContainer';

export type PendingChallengeDialogProps = Pick<DialogProps, 'title' | 'visible'> &
  Omit<PendingChallengeContainerProps, 'onAccepted' | 'onMatched'> & {
    onCanceled: () => void;
    onAccepted: (r: RoomRecord) => void;
    onMatched: (r: RoomRecord) => void;
  };

export const PendingChallengeDialog: React.FC<PendingChallengeDialogProps> = ({
  challenge,
  title = 'Congrats! Game Created 🥳',
  visible,
  onAccepted,
  onMatched,
  onCanceled,
}) => {
  return (
    <Dialog
      visible={visible}
      title={title}
      content={
        <PendingChallengeContainer
          challenge={challenge}
          onAccepted={({ room }) => {
            onAccepted(room);

            Events.trackChallengeCreated('Quick Pairing');
          }}
          onMatched={({ room }) => {
            onMatched(room);

            Events.trackQuickPairingMatched();
          }}
        />
      }
      buttons={[
        {
          label: 'Cancel',
          type: 'secondary',
          withLoader: true,
          onClick: () => {
            return resources
              .deleteChallenge(challenge.id)
              .map(AsyncResult.passThrough(() => {
                onCanceled();
              }));
          },
        },
      ]}
    />
  );
};