import { RoomRecord } from 'chessroulette-io';
import React from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { resources } from 'src/resources';
import { Events } from 'src/services/Analytics';
import { AsyncResult } from 'ts-async-results';
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
      hasCloseButton={false}
      content={
        <PendingChallengeContainer
          challenge={challenge}
          onAccepted={({ room }) => {
            onAccepted(room);

            Events.trackFriendlyChallengeAccepted();
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
          onClick: () =>
            resources.deleteChallenge(challenge.id).map(
              AsyncResult.passThrough(() => {
                onCanceled();
              })
            ),
        },
      ]}
    />
  );
};
