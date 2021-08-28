import React, { useState } from 'react';
import { GameSpecsRecord } from 'dstnd-io';
import { CreateChallenge } from 'src/modules/Challenges/Widgets/ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';


type Props = {
  onFinished: (s: GameSpecsRecord) => void;
};

export const CreateLichessRoomWizard: React.FC<Props> = (props) => {

  const [specsState, setSpecsState] = useState<GameSpecsRecord>({
      timeLimit: 'rapid10',
      preferredColor: 'random',
  });

  return (
    <DialogWizardStep
      title="Yey, you are creating a Game"
      graphic={<Mutunachi mid="9" />}
      buttons={[
        {
          label: 'Next',
          onClick: () => props.onFinished(specsState),
        },
      ]}
    >
      <CreateChallenge onUpdated={setSpecsState} gameSpecs={specsState} />
    </DialogWizardStep>
  );
};
