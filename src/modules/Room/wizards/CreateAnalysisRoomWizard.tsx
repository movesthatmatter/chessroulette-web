import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { AVCheckStep } from './steps/AVCheckStep';
import { UnknownAsyncResult } from 'src/lib/types';

type Props = {
  onFinished: (s: WizardState) => UnknownAsyncResult;
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
