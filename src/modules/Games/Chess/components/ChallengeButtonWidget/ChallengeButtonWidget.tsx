import React, { useEffect, useState } from 'react';
import { Box } from 'grommet';
import { ChessChallengeCreator } from 'src/modules/Games/Chess/components/ChessChallengeCreator';
import { ChallengeRecord, GameSpecsRecord, RoomRecord } from 'dstnd-io';
import { Button, ButtonProps } from 'src/components/Button';
import { resources } from 'src/resources';
import { Dialog } from 'src/components/Dialog/Dialog';
import { useSelector } from 'react-redux';
import { selectMyPeer } from 'src/components/PeerProvider';
import { Events } from 'src/services/Analytics';
import { toRoomUrlPath } from 'src/lib/util';
import { useHistory } from 'react-router-dom';
import { PendingChallenge } from '../PendingChallenge';
import { ChallengePage } from 'src/modules/Challenges';
import { ChallengeWidget } from 'src/modules/Challenges/Widgets/ChallengeWidget';

type Props = Omit<ButtonProps, 'onClick'> & {
  challengeType: ChallengeRecord['type'];
};

type ChallengeState =
  | {
      state: 'none';
    }
  | {
      state: 'pending';
      challenge: ChallengeRecord;
    }
  | {
      state: 'accepted';
      room: RoomRecord;
    };

export const ChallengeButtonWidget: React.FC<Props> = ({ challengeType, ...buttonProps }) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord | undefined>(undefined);
  const [challengeState, setChallengeState] = useState<ChallengeState>({ state: 'none' });
  const myPeer = useSelector(selectMyPeer);
  const history = useHistory();
  const readyToSubmit = gameSpecs && myPeer;

  useEffect(() => {
    if (!visiblePopup) {
      setChallengeState({ state: 'none' });
    }
  }, [visiblePopup]);

  const cancel = () => {
    if (challengeState.state === 'pending') {
      return resources.deleteChallenge(challengeState.challenge.id).map(() => {
        setVisiblePopup(false);
      });
    }

    setVisiblePopup(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setChallengeState({ state: 'none' });
          setVisiblePopup(true);
        }}
        {...buttonProps}
        disabled={!myPeer || buttonProps.disabled}
      />
      {visiblePopup && (
        <ChallengeWidget 
          challengeType={challengeType}
          onCanceled={() => setVisiblePopup(false)}
          onAccepted={(room) => {
            history.push(toRoomUrlPath(room));
          }}
        />
      )}
      {/* <Dialog
        visible={visiblePopup}
        content={
          <Box>
            {challengeState.state === 'pending' && (
              <PendingChallenge
                challenge={challengeState.challenge}
                onChallengeAccepted={({ room }) => {
                  setChallengeState({
                    state: 'accepted',
                    room,
                  });
                  setVisiblePopup(false);

                  history.push(toRoomUrlPath(room));
                }}
              />
            )}
            {challengeState.state === 'none' && <ChessChallengeCreator onUpdate={setGameSpecs} />}
          </Box>
        }
        onClose={cancel}
        buttons={[
          {
            label: 'Cancel',
            type: 'secondary',
            onClick: cancel,
          },
          challengeState.state === 'none' && {
            label: 'Play',
            type: 'primary',
            onClick: () => {
              if (!(myPeer && gameSpecs)) {
                return;
              }

              if (challengeType === 'private') {
                resources
                  .createChallenge({
                    type: 'private',
                    gameSpecs,
                    userId: myPeer.user.id,
                  })
                  .map((challenge) => {
                    setChallengeState({
                      state: 'pending',
                      challenge,
                    });

                    Events.trackChallengeCreated('Friendly Challenge');
                  });
              } else {
                resources
                  .quickPair({
                    gameSpecs,
                    userId: myPeer.user.id,
                  })
                  .map((r) => {
                    if (r.matched) {
                      setChallengeState({
                        state: 'none',
                      });

                      history.push(toRoomUrlPath(r.room));

                      Events.trackQuickPairingMatched();
                    } else {
                      setChallengeState({
                        state: 'pending',
                        challenge: r.challenge,
                      });

                      Events.trackChallengeCreated('Quick Pairing');
                    }
                  });
              }
            },
            disabled: !readyToSubmit,
          },
        ]}
      /> */}
    </>
  );
};
