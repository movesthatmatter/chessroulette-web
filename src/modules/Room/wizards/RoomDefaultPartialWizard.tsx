import React from 'react';
import { RoomRecord } from 'dstnd-io';
import { UnknownAsyncResult } from 'src/lib/types';
import { AVCheckStep } from './steps/AVCheckStep';
import { EmptyLastStep } from './steps/EmptyLastStep';

type Props = {
  roomSpecs: Partial<Pick<RoomRecord, 'p2pCommunicationType'>>;
  onFinished: () => UnknownAsyncResult;
};

export const RoomDefaultPartialWizard: React.FC<Props> = (props) => {
  if (props.roomSpecs.p2pCommunicationType === 'audioVideo') {
    return <AVCheckStep onSuccess={props.onFinished} />;
  }

  return <EmptyLastStep onFinished={props.onFinished} />;
};
