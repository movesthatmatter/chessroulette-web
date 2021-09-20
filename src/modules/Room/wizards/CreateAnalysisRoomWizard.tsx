import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { AVCheckStep } from './steps/AVCheckStep';

type Props = {
  onFinished: (s: WizardState) => void;
};

type WizardState = {};

export const CreateAnalysisRoomWizard: React.FC<Props> = (props) => {
  const [wizardState, setWizardState] = useState<WizardState>({});

  return (
    <Wizard>
      <AVCheckStep onSuccess={() => props.onFinished(wizardState)} hasPrev={false} />
    </Wizard>
  );
};
