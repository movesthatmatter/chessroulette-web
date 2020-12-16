import { ChallengeRecord, RoomRecord, UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { useGenericRoomBouncer } from 'src/modules/GenericRoom';
import { BrowserNotSupportedDialog } from 'src/modules/GenericRoom';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { AcceptChallengeDialog } from './components/AcceptChallenge';
import { CreateChallengeDialog } from './components/CreateChallenge';
import { PendingChallengeDialog } from './components/PendingChallenge';

type Props = {
  // Called when a challenge is created
  onCreated?: (challenge: ChallengeRecord) => void;
  // Called When a Quick Pair (public) is matched
  onMatched?: (room: RoomRecord) => void;
  // Called when a private challenge is accepted
  onAccepted?: (room: RoomRecord) => void;
  // Called when the User Exitst he Dialog
  onCanceled?: () => void;
  // Called when the User Denies an Accepting Challenge
  onDenied?: () => void;
} & (
  | {
      challenge?: undefined;
      challengeType: ChallengeRecord['type'];
    }
  | {
      challenge: ChallengeRecord;
      challengeType?: undefined;
    }
);

type State =
  | {
      type: 'create';
      challengeType: ChallengeRecord['type'];
    }
  | {
      type: 'pending';
      challenge: ChallengeRecord;
    }
  | {
      type: 'accept';
      challenge: ChallengeRecord;
    };

export const ChallengeWidget: React.FC<Props> = ({
  onCreated = noop,
  onMatched = noop,
  onAccepted = noop,
  onDenied = noop,
  onCanceled = noop,
  ...props
}) => {
  const getInitialState = (user?: UserRecord): State | undefined => {
    if (!user) {
      return undefined;
    }

    if (!props.challenge) {
      return {
        type: 'create',
        challengeType: props.challengeType,
      };
    }

    if (props.challenge.createdBy === user.id) {
      return {
        type: 'pending',
        challenge: props.challenge,
      };
    }

    return {
      type: 'accept',
      challenge: props.challenge,
    };
  };

  const user = useAuthenticatedUser();
  const { state: bouncerState, checkBrowserSupport } = useGenericRoomBouncer();
  const [state, setState] = useState<State | undefined>(undefined);

  useEffect(() => {
    setState(getInitialState(user));
  }, [props.challenge, props.challengeType, user]);

  useEffect(() => {
    checkBrowserSupport();
  }, []);

  // let the Global Bouncer Dialog deal with it!
  if (!bouncerState.browserIsSupported) {
    return null;
  }

  if (!(state && user)) {
    return null;
  }

  if (state.type === 'create') {
    return (
      <CreateChallengeDialog
        visible
        user={user}
        challengeType={state.challengeType}
        onCancel={() => {
          setState(undefined);
          onCanceled();
        }}
        onMatched={onMatched}
        onCreated={(challenge) => {
          setState({
            type: 'pending',
            challenge,
          });

          onCreated(challenge);
        }}
      />
    );
  }

  if (state.type === 'pending') {
    return (
      <PendingChallengeDialog
        visible
        challenge={state.challenge}
        onAccepted={onAccepted}
        onCanceled={onCanceled}
        onMatched={onMatched}
      />
    );
  }

  if (state.type === 'accept') {
    return (
      <AcceptChallengeDialog
        visible
        user={user}
        challenge={state.challenge}
        onDenied={onDenied}
        onAccepted={onAccepted}
      />
    );
  }

  return null;
};
