import { CreateRoomRequest, RoomActivityCreationRecord } from 'dstnd-io';
import React, { useCallback, useEffect, useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { useAnyUser } from 'src/services/Authentication';
import { CreatePlayChallengeStep } from '../steps/CreatePlayChallengeStep';
import { Events } from 'src/services/Analytics';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';
import { AsyncErr } from 'ts-async-results';
import { RoomDefaultPartialWizard } from '../RoomDefaultPartialWizard';
import * as resources from '../../resources';

type Props = {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activityType' | 'p2pCommunicationType'>;
};

type WizardState = RoomActivityCreationRecord;

const getDefaultWizardState = ({ activityType }: Props['createRoomSpecs']): WizardState => {
  if (activityType === 'analysis') {
    return {
      activityType: 'analysis',
      history: [],
    };
  }

  if (activityType === 'play') {
    return {
      activityType: 'play',
      gameSpecs: {
        timeLimit: 'rapid10',
        preferredColor: 'random',
      },
    };
  }

  return {
    activityType: 'none',
  };
};

export const CreateRoomWizard: React.FC<Props> = ({ createRoomSpecs }) => {
  const [wizardState, setWizardState] = useState<WizardState>(
    getDefaultWizardState(createRoomSpecs)
  );
  const user = useAnyUser();
  const history = useHistory();

  const onFinish = useCallback(() => {
    if (!user) {
      return AsyncErr.EMPTY;
    }

    if (!wizardState) {
      return AsyncErr.EMPTY;
    }

    return resources
      .createRoom({
        userId: user.id,
        type: createRoomSpecs.type,
        p2pCommunicationType: createRoomSpecs.p2pCommunicationType,
        ...wizardState,
      })
      .map((room) => {
        Events.trackRoomCreated(room);
        history.push(toRoomUrlPath(room));
      });
  }, [wizardState, user?.id, createRoomSpecs]);

  useEffect(() => {
    setWizardState(getDefaultWizardState(createRoomSpecs));
  }, [createRoomSpecs]);

  if (!user) {
    return null;
  }

  return (
    <Wizard>
      {createRoomSpecs.activityType === 'play' && (
        <CreatePlayChallengeStep
          onUpdated={(gameSpecs) =>
            setWizardState({
              activityType: 'play',
              gameSpecs,
            })
          }
        />
      )}
      <RoomDefaultPartialWizard onFinished={onFinish} roomSpecs={createRoomSpecs} />
    </Wizard>
  );
};
