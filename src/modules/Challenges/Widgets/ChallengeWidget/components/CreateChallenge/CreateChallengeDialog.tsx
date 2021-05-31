import { AsyncResult, ChallengeRecord, GameSpecsRecord, RoomRecord, UserRecord } from 'dstnd-io';
import React, { useState } from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { resources } from 'src/resources';
import { Events } from 'src/services/Analytics';
import { CreateChallenge } from './CreateChallenge';

type Props = Pick<DialogProps, 'title' | 'visible'> & {
  user: UserRecord;
  onCancel: () => void;
  onCreated: (c: ChallengeRecord) => void;
} & (
  | {
      challengeType: 'private';
    }
  | {
      challengeType: 'public';
      onMatched: (r: RoomRecord) => void;
    }
);

export const CreateChallengeDialog: React.FC<Props> = ({
  visible,
  title = 'Create a Game',
  ...props
}) => {
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord>({
    timeLimit: 'rapid10',
    preferredColor: 'random',
  });

  const createChallenge = () => {
    if (props.challengeType === 'private') {
      return resources
        .createChallenge({
          type: 'private',
          gameSpecs,
          userId: props.user.id,
        })
        .map(
          AsyncResult.passThrough((challenge) => {
            props.onCreated(challenge);

            Events.trackChallengeCreated('Friendly Challenge');
          })
        );
    } else {
      return resources
        .quickPair({
          gameSpecs,
          userId: props.user.id,
        })
        .map(
          AsyncResult.passThrough((r) => {
            if (r.matched) {
              props.onMatched(r.room);

              Events.trackQuickPairingMatched();
            } else {
              props.onCreated(r.challenge);

              Events.trackChallengeCreated('Quick Pairing');
            }
          })
        );
    }
  };

  return (
    <Dialog
      visible={visible}
      hasCloseButton={false}
      title={title}
      content={<CreateChallenge gameSpecs={gameSpecs} onUpdated={setGameSpecs} />}
      buttons={[
        {
          label: 'Cancel',
          type: 'secondary',
          withLoader: true,
          onClick: props.onCancel,
        },
        {
          label: 'Create',
          type: 'primary',
          withLoader: true,
          onClick: createChallenge,
        },
      ]}
    />
  );
};
