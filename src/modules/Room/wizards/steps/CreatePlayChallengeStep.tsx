import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useWizard } from 'react-use-wizard';
import { CreateChallenge } from 'src/modules/Challenges/Widgets/ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { GameSpecsRecord } from 'dstnd-io';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

type Props = {
  gameSpecs: GameSpecsRecord;
  onUpdated: (gameSpecs: GameSpecsRecord) => void;
};

export const CreatePlayChallengeStep: React.FC<Props> = (props) => {
  const cls = useStyles();
  const wizardProps = useWizard();

  return (
    <DialogWizardStep
      title="Yey, you are creating a Game"
      graphic={<Mutunachi mid="9" />}
      buttons={[
        {
          label: 'Next',
          onClick: wizardProps.nextStep,
        },
      ]}
    >
      <CreateChallenge onUpdated={props.onUpdated} gameSpecs={props.gameSpecs} />
    </DialogWizardStep>
  );
};

const useStyles = createUseStyles({
  container: {},
});
