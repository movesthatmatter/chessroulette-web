import React, { useCallback, useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { RoomChallengeRecord, RoomRecord, UserInfoRecord } from 'dstnd-io';
import { getRoomPendingChallenge } from '../../util';
import { AcceptRoomStep } from '../steps/AcceptRoomStep';
import { resources } from '../..';
import { UnknownAsyncResult } from 'src/lib/types';
import { AsyncOk, AsyncResult } from 'ts-async-results';
import { Events } from 'src/services/Analytics';
import { RoomDefaultPartialWizard } from '../RoomDefaultPartialWizard';

type Props = {
  myUser: UserInfoRecord;
  roomInfo: RoomRecord;
  onFinished: () => UnknownAsyncResult;
};

type WizardState =
  | {
      challengeAccepted: false;
      pendingChallenge: RoomChallengeRecord | undefined;
    }
  | {
      challengeAccepted: true;
      pendingChallenge: RoomChallengeRecord;
    };

export const JoinRoomWizard: React.FC<Props> = (props) => {
  const [state, setState] = useState<WizardState>({
    challengeAccepted: false,
    pendingChallenge: getRoomPendingChallenge(props.roomInfo),
  });

  const onFinish = useCallback(() => {
    if (state.challengeAccepted) {
      return (
        resources
          .acceptRoomChallenge({
            challengeId: state.pendingChallenge.id,
            roomId: state.pendingChallenge.roomId,
          })
          .map(
            AsyncResult.passThrough(() => {
              Events.trackRoomChallengeAccepted(state.pendingChallenge);
            })
          )
          // TODO: Handle error
          .flatMap(() => props.onFinished())
      );
    } else {
      return props.onFinished();
    }
  }, [state]);

  return (
    <Wizard>
      <AcceptRoomStep
        roomInfo={props.roomInfo}
        onChallengeSkipped={() => {
          setState({
            challengeAccepted: false,
            pendingChallenge: undefined,
          });

          return AsyncOk.EMPTY;
        }}
        onChallengeAccepted={(pendingChallenge) => {
          setState({
            challengeAccepted: true,
            pendingChallenge,
          });

          return AsyncOk.EMPTY;
        }}
      />
      <RoomDefaultPartialWizard onFinished={onFinish} roomSpecs={props.roomInfo} />
    </Wizard>
  );
};
