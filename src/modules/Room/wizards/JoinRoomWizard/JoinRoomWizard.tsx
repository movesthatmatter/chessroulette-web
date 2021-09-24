import React, { useState } from 'react';
import { Wizard } from 'react-use-wizard';
import { RoomChallengeRecord, RoomRecord, UserInfoRecord } from 'dstnd-io';
import { AVCheckStep } from '../steps/AVCheckStep';
import { getRoomPendingChallenge } from '../../util';
// import { resources } from 'src/resources';
import { AcceptRoomStep } from '../steps/AcceptRoomStep';
import { resources } from '../..';
import { UnknownAsyncResult } from 'src/lib/types';
import { AsyncOk, AsyncResultWrapper } from 'ts-async-results';

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
      <AVCheckStep
        submitButtonLabel="Join"
        onSuccess={() => {
          if (state.challengeAccepted) {
            return resources
              .acceptRoomChallenge({
                challengeId: state.pendingChallenge.id,
                roomId: state.pendingChallenge.roomId,
              })
              // TODO: Handle error
              .flatMap(() => props.onFinished());
          } else {
            return props.onFinished();
          }
        }}
      />
    </Wizard>
  );
};
