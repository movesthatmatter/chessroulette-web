import React from 'react';
import { useWizard } from 'react-use-wizard';
import { CreateChallenge } from 'src/modules/Challenges/Widgets/ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { GameSpecsRecord } from 'dstnd-io';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

type Props = {
  onUpdated: (gameSpecs: GameSpecsRecord) => void;
  gameSpecs?: GameSpecsRecord;
};

export const CreatePlayChallengeStep: React.FC<Props> = ({
  onUpdated,
  gameSpecs = {
    timeLimit: 'rapid10',
    preferredColor: 'random',
  },
}) => {
  const wizardProps = useWizard();

  return (
    <DialogWizardStep
      title="Yey, you are creating a Game"
      graphic={<Mutunachi mid="9" />}
      buttons={[
        {
          label: 'Next',
          withLoader: true,
          onClick: wizardProps.nextStep,
        },
      ]}
    >
      <CreateChallenge onUpdated={onUpdated} gameSpecs={gameSpecs} />
    </DialogWizardStep>
  );
};
