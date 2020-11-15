import React, { useEffect, useState } from 'react';
import { Box } from 'grommet';
import { ChessChallengeCreator } from 'src/modules/Games/Chess/components/ChessChallengeCreator';
import { ChallengeRecord, GameSpecsRecord, RoomRecord } from 'dstnd-io';
import { Button, ButtonProps } from 'src/components/Button';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PendingChallenge, PendingChallengeProps } from './PendingChallenge';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';
import { Dialog } from 'src/components/Dialog/Dialog';
import { AwesomeError } from 'src/components/AwesomeError';
import { selectAuthentication } from 'src/services/Authentication';
import { useSelector } from 'react-redux';
import { selectMyPeer } from 'src/components/PeerProvider';

type Props = Omit<ButtonProps, 'onClick'> & {
  challengeType: PendingChallengeProps['type'];
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

export const ChallengeButtonWidget: React.FC<Props> = ({
  challengeType,
  ...buttonProps
}) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord | undefined>(undefined);
  const [challengeState, setChallengeState] = useState<ChallengeState>({ state: 'none' });
  const history = useHistory();
  const myPeer = useSelector(selectMyPeer);

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
    };

    setVisiblePopup(false);
  }

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
      <Dialog
        visible={visiblePopup}
        content={
          // The SOCKET Consumer should be replaced with PeerConsumer or something More High Level
          // eithe a PeerConnection hook or another HighOrderComponent
          <SocketConsumer
            onMessage={(msg) => {
              if (msg.kind === 'challengeAccepted') {
                setChallengeState({
                  state: 'accepted',
                  room: msg.content.room,
                });

                history.push(toRoomUrlPath(msg.content.room));
              }
            }}
            fallbackRender={() => (
              <AwesomeError />
            )}
            render={() => (
              <Box>
                {challengeState.state === 'pending' ? (
                  <PendingChallenge
                    challenge={challengeState.challenge}
                    type={challengeType}
                  />
                ) : (
                  <>
                    <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
                    <Box margin={{
                      top: '28px',
                    }}>
                      <ChessChallengeCreator onUpdate={setGameSpecs} />
                    </Box>
                  </>
                )}
              </Box>
            )}
          />
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
              if (!(myPeer && gameSpecs) ) {
                return;
              }

              if (challengeType === 'challenge') {
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
                  });
              } else {
                resources
                  .quickPair({
                    gameSpecs,
                    userId: myPeer.user.id,
                  })
                  .map((r) => {
                    if (r.matched) {
                      history.push(toRoomUrlPath(r.room));
                    } else {
                      setChallengeState({
                        state: 'pending',
                        challenge: r.challenge,
                      });
                    }
                  });
              }
            },
            disabled: !(faceTimeOn && gameSpecs && myPeer),
          },
        ]}
      />
    </>
  );
};
