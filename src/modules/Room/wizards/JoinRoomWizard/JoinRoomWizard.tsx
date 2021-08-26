import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { ChallengeRecord, RoomRecord } from 'dstnd-io';
import { AVCheckStep } from '../steps/AVCheckStep';
import { AcceptPlayChallengeStep } from '../steps/AcceptPlayChallengeStep';

type Props = {
  roomInfo: RoomRecord;
  onFinished: (s: WizardState) => void;
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
  const [wizardState, setWizardState] = useState<WizardState>({
    challengeAccepted: false,

    // TODO: Make sure this isn't mine
    pendingChallenge: Object.values(props.roomInfo.pendingChallenges)[0],
  });

  return (
    <Wizard>
      {wizardState.pendingChallenge && (
        <AcceptPlayChallengeStep
          roomInfo={props.roomInfo}
          challenge={wizardState.pendingChallenge}
          onAccepted={() => {
            if (wizardState.pendingChallenge) {
              setWizardState({
                challengeAccepted: true,
                pendingChallenge: wizardState.pendingChallenge,
              });
            }
          }}
        />
      )}
      <AVCheckStep onSuccess={() => props.onFinished(wizardState)} />
    </Wizard>
  );
};
