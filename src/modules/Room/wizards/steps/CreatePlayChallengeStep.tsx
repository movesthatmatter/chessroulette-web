import React from 'react';
import { useWizard } from 'react-use-wizard';
import { CreateChallenge } from 'src/modules/Challenges/Widgets/ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { GameSpecsRecord } from 'dstnd-io';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

type Props = {
  gameSpecs: GameSpecsRecord;
  onUpdated: (gameSpecs: GameSpecsRecord) => void;
  type: 'play' | 'lichess'
};

export const CreatePlayChallengeStep: React.FC<Props> = ({
  type = 'play',
  ...props}) => {
  const wizardProps = useWizard();

  return (
    <DialogWizardStep
      title={
        type === 'play' ? "Yey, you are creating a Game" : "Set your preferences and seek a game on Lichess"}
      graphic={<Mutunachi mid="9" />}
      buttons={[
        {
          label: 'Next',
          onClick: wizardProps.nextStep,
        },
      ]}
    >
      <CreateChallenge onUpdated={props.onUpdated} gameSpecs={props.gameSpecs} activityType={type}/>
    </DialogWizardStep>
  );
};
