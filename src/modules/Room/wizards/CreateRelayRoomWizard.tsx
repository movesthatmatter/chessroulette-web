import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { AVCheckStep } from './steps/AVCheckStep';
import { UnknownAsyncResult } from 'src/lib/types';

type Props = {
  onFinished: () => UnknownAsyncResult;
};

export const CreateRelayRoomWizard: React.FC<Props> = (props) => {

  return (
    <Wizard>
      <AVCheckStep onSuccess={() => props.onFinished()} hasPrev={false} />
    </Wizard>
  );
};
