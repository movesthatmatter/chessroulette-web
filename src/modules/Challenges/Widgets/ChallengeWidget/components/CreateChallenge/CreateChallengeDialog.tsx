import { AsyncResult, ChallengeRecord, GameSpecsRecord, RoomRecord, UserRecord } from 'dstnd-io';
import { CheckBox } from 'grommet';
import React, { useState } from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { createUseStyles } from 'src/lib/jss';
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
  title = 'Yey, you are about to Create a Game!',
  ...props
}) => {
  const cls = useStyles();
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
      graphic={
        <div className={cls.mutunachiContainer}>
          <Mutunachi mid="9" />
        </div>
      }
      content={
        <div>
          <CreateChallenge gameSpecs={gameSpecs} onUpdated={setGameSpecs} />
          <CheckBox />
        </div>
      }
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

const useStyles = createUseStyles({
  mutunachiContainer: {
    width: '50%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
});
