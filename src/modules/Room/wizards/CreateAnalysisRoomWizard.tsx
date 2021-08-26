import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Wizard } from 'react-use-wizard';
import { GameSpecsRecord } from 'dstnd-io';
import { CreatePlayChallengeStep } from './steps/CreatePlayChallengeStep';
import { AVCheckStep } from './steps/AVCheckStep';
import { DialogWizard } from 'src/components/DialogWizard/DialogWizard';

type Props = {
  onFinished: (s: WizardState) => void;
};

type WizardState = {};

export const CreateAnalysisRoomWizard: React.FC<Props> = (props) => {
  const cls = useStyles();

  const [wizardState, setWizardState] = useState<WizardState>({});

  return (
    <Wizard>
      <AVCheckStep onSuccess={() => props.onFinished(wizardState)} />
    </Wizard>
    // <DialogWizard visible={props.visible} onClose={() => setShowWizard(false)}>
    //     <CreatePlayChallengeStep />
    //     <AVCheckStep />
    //   </DialogWizard>
  );
};

const useStyles = createUseStyles({
  container: {},
});
