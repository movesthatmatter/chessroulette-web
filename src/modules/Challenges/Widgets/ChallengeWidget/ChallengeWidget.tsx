import capitalize from 'capitalize';
import {
  ChallengeRecord,
  GameSpecsRecord,
  RoomRecord,
  UserRecord,
} from 'dstnd-io';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonProps } from 'src/components/Button';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { noop } from 'src/lib/util';
import { resources } from 'src/resources';
import { Events } from 'src/services/Analytics';
import { selectAuthentication } from 'src/services/Authentication';
import { CreateChallenge } from './components/CreateChallenge';
import { PendingChallenge } from './components/PendingChallenge';

type Props = {
  onMatched?: (room: RoomRecord) => void;
  onAccepted?: (room: RoomRecord) => void;
  onDenied?: () => void;

  // Do we need this?
  onCanceled?: () => void;
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

type CreatingChallengeState = {
  state: 'creatingChallenge';
  gameSpecs: GameSpecsRecord;
  title: string;
  content: DialogProps['content'];
  buttons: ButtonProps[];
};

type WaitingForPairingState = {
  state: 'waitingForPairing';
  challenge: ChallengeRecord;
  content: DialogProps['content'];
  title: string;
  buttons: ButtonProps[];
};

type AccepingtChallengeState = {
  state: 'acceptingChallenge';
  challenge: ChallengeRecord;
  content: DialogProps['content'];
  title: string;
  buttons: ButtonProps[];
};

type State = CreatingChallengeState | WaitingForPairingState | AccepingtChallengeState;

export const ChallengeWidget: React.FC<Props> = ({
  onMatched = noop,
  onAccepted = noop,
  onCanceled = noop,
  onDenied = noop,
  ...props
}) => {
  const getCancelButton = (onClick: () => void): ButtonProps => ({
    label: 'Cancel',
    type: 'secondary',
    onClick: () => {
      setState(undefined);
      onClick();
    },
  });

  const getWaitingForPairingState = (challenge: ChallengeRecord): WaitingForPairingState => {
    return {
      state: 'waitingForPairing',
      challenge,
      title: 'Congrats! Challenge Created',
      buttons: [
        getCancelButton(() => {
          return resources.deleteChallenge(challenge.id).map(() => {
            onCanceled();
          });
        }),
      ],
      content: (
        <PendingChallenge
          challenge={challenge}
          onChallengeAccepted={({ room }) => {
            onAccepted(room);
          }}
        />
      ),
    };
  };

  const getCreatingChallengeState = (
    gameSpecs: ChallengeRecord['gameSpecs'] = {
      timeLimit: 'rapid',
      preferredColor: 'random',
    },
    user: UserRecord
  ): CreatingChallengeState => {
    return {
      state: 'creatingChallenge',
      gameSpecs,
      title: 'Create a Game',
      content: (
        <CreateChallenge
          onUpdate={(gameSpecs) => {
            setState((prev) => {
              if (prev?.state !== 'creatingChallenge') {
                return prev;
              }

              return {
                ...prev,
                gameSpecs,
              };
            });
          }}
        />
      ),
      buttons: [
        getCancelButton(onCanceled),
        {
          label: 'Play',
          type: 'primary',
          onClick: () => {
            if (props.challengeType === 'private') {
              resources
                .createChallenge({
                  type: 'private',
                  gameSpecs,
                  userId: user.id,
                })
                .map((challenge) => {
                  setState(getWaitingForPairingState(challenge));

                  Events.trackChallengeCreated('Friendly Challenge');
                });
            } else {
              resources
                .quickPair({
                  gameSpecs,
                  userId: user.id,
                })
                .map((r) => {
                  if (r.matched) {
                    onMatched(r.room);

                    Events.trackQuickPairingMatched();
                  } else {
                    setState(getWaitingForPairingState(r.challenge));

                    Events.trackChallengeCreated('Quick Pairing');
                  }
                });
            }
          },
        },
      ],
    };
  };

  const getAcceptingChallengeState = (
    challenge: ChallengeRecord,
    user: UserRecord
  ): AccepingtChallengeState => ({
    state: 'acceptingChallenge',
    title: `You've Been Challenged`,
    content: {
      __html: `Do you want to Play a <b>${capitalize(challenge.gameSpecs.timeLimit)}</b> game?`,
    },
    buttons: [
      getCancelButton(onCanceled),
      {
        type: 'primary',
        label: 'Play',
        onClick: () => {
          resources
            .acceptChallenge({
              id: challenge.id,
              userId: user.id,
            })
            .map((room) => {
              onAccepted(room);
            });
        },
      },
    ],
    challenge,
  });

  const getState = (
    user: UserRecord,
    opts:
      | {
          challenge: ChallengeRecord;
        }
      | {
          challenge?: undefined;
          gameSpecs?: GameSpecsRecord;
          challengeType: ChallengeRecord['type'];
        }
  ): State => {
    if (!opts.challenge) {
      return getCreatingChallengeState(opts.gameSpecs, user);
    }

    if (opts.challenge.createdBy === user.id) {
      return getWaitingForPairingState(opts.challenge);
    }

    return getAcceptingChallengeState(opts.challenge, user);
  };

  const auth = useSelector(selectAuthentication);
  const [state, setState] = useState<State | undefined>(
    auth.authenticationType === 'none'
      ? undefined
      : getState(
          auth.user,
          props.challenge ? { challenge: props.challenge } : { challengeType: props.challengeType }
        )
  );

  if (!state) {
    return null;
  }

  return <Dialog visible title={state.title} content={state.content} buttons={state.buttons} />;
};
