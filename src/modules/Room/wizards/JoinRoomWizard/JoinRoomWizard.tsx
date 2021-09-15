import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { ChallengeRecord, RoomRecord, UserInfoRecord } from 'dstnd-io';
import { AVCheckStep } from '../steps/AVCheckStep';
import { AcceptPlayChallengeStep } from '../steps/AcceptPlayChallengeStep';
import { getRoomPendingChallenge } from '../../util';
import { resources } from 'src/resources';

type Props = {
  myUser: UserInfoRecord;
  roomInfo: RoomRecord;
  onFinished: () => void;
};

type WizardState =
  | {
      challengeAccepted: false;
      pendingChallenge: ChallengeRecord | undefined;
    }
  | {
      challengeAccepted: true;
      pendingChallenge: ChallengeRecord;
    };

export const JoinRoomWizard: React.FC<Props> = (props) => {
  const [state, setState] = useState<WizardState>({
    challengeAccepted: false,
    pendingChallenge: getRoomPendingChallenge(props.roomInfo),
  });

  return (
    <Wizard>
      {state.pendingChallenge && (
        <AcceptPlayChallengeStep
          roomInfo={props.roomInfo}
          challenge={state.pendingChallenge}
          onAccepted={() => {
            if (!state.pendingChallenge) {
              return;
            }

            setState({
              pendingChallenge: state.pendingChallenge,
              challengeAccepted: true,
            });
          }}
        />
      )}
      <AVCheckStep
        onSuccess={() => {
          if (state.challengeAccepted) {
            resources
              .acceptChallenge({
                id: state.pendingChallenge.id,
                userId: props.myUser.id,
              })
              // TODO: Handle error
              .map(() => {
                props.onFinished();
              });
          } else {
            props.onFinished();
          }
        }}
      />
    </Wizard>
  );
};
