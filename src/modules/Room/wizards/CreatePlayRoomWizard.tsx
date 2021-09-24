import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { GameSpecsRecord } from 'dstnd-io';
import { CreatePlayChallengeStep } from './steps/CreatePlayChallengeStep';
import { AVCheckStep } from './steps/AVCheckStep';
import { UnknownAsyncResult } from 'src/lib/types';

type Props = {
  onFinished: (s: WizardState) => UnknownAsyncResult;
};

type WizardState = {
  gameSpecs: GameSpecsRecord;
};

export const CreatePlayRoomWizard: React.FC<Props> = (props) => {
  const [wizardState, setWizardState] = useState<WizardState>({
    gameSpecs: {
      timeLimit: 'rapid10',
      preferredColor: 'random',
    },
  });

  return (
    <Wizard>
      <CreatePlayChallengeStep
        gameSpecs={wizardState.gameSpecs}
        onUpdated={(nextGameSpecs) => setWizardState({ gameSpecs: nextGameSpecs })}
      />
      <AVCheckStep onSuccess={() => props.onFinished(wizardState)} />
    </Wizard>
  );
};
