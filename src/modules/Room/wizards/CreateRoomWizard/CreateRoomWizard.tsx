import { CreateRoomRequest, RoomActivityCreationRecord } from 'dstnd-io';
import React, { useEffect, useMemo, useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { CreatePlayChallengeStep } from '../steps/CreatePlayChallengeStep';
import { RoomDefaultPartialWizard } from '../RoomDefaultPartialWizard';
import { useCreateRoom } from '../../widgets/CreateRoomWidget';

export type CreateRoomWizardProps = {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'p2pCommunicationType' | 'isPrivate'> &
    Pick<CreateRoomRequest['activity'], 'activityType'>;
};

type WizardState = RoomActivityCreationRecord;

const getDefaultWizardState = ({
  activityType,
}: CreateRoomWizardProps['createRoomSpecs']): WizardState => {
  if (activityType === 'analysis') {
    return {
      activityType: 'analysis',
      source: 'empty',
    };
  }

  if (activityType === 'play') {
    return {
      activityType: 'play',
      gameSpecs: {
        timeLimit: 'rapid10',
        preferredColor: 'random',
        gameType: 'chess',
      },
    };
  }

  if (activityType === 'warGame') {
    return {
      activityType: 'play',
      gameSpecs: {
        timeLimit: 'rapid10',
        preferredColor: 'random',
        gameType: 'warGame',
      },
    };
  }

  return {
    activityType: 'none',
  };
};

export const CreateRoomWizard: React.FC<CreateRoomWizardProps> = ({ createRoomSpecs }) => {
  const [wizardState, setWizardState] = useState<WizardState>(
    getDefaultWizardState(createRoomSpecs)
  );
  const roomSpecs = useMemo(
    () => ({
      type: createRoomSpecs.type,
      p2pCommunicationType: createRoomSpecs.p2pCommunicationType,
      activity: wizardState,
    }),
    [wizardState]
  );

  const createRoomState = useCreateRoom(roomSpecs);

  useEffect(() => {
    setWizardState(getDefaultWizardState(createRoomSpecs));
  }, [createRoomSpecs]);

  return (
    <Wizard>
      {wizardState.activityType === 'play' || wizardState.activityType === 'warGame' && (
        <CreatePlayChallengeStep
          gameSpecs={wizardState.gameSpecs}
          onUpdated={(gameSpecs) =>
            setWizardState({
              activityType: 'play',
              gameSpecs,
            })
          }
        />
      )}
      <RoomDefaultPartialWizard
        onFinished={createRoomState.createRoom}
        roomSpecs={createRoomSpecs}
      />
    </Wizard>
  );
};
