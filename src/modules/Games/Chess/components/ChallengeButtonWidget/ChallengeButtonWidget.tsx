import React, { useState } from 'react';
import { Box, Layer } from 'grommet';
import { ChessChallengeCreator } from 'src/modules/Games/Chess/components/ChessChallengeCreator';
import { ChallengeRecord, GameSpecsRecord, RoomRecord, UserRecord } from 'dstnd-io';
import { Button, ButtonProps } from 'src/components/Button';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PendingChallenge, PendingChallengeProps } from './PendingChallenge';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';
import { Dialog } from 'src/components/Dialog/Dialog';
import { AwesomeError } from 'src/components/AwesomeError';

type Props = Omit<ButtonProps, 'onClick'> & {
  challengeType: PendingChallengeProps['type'];
  userId: UserRecord['id'];
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
  userId,
  ...buttonProps
}) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord | undefined>(undefined);
  const [challengeState, setChallengeState] = useState<ChallengeState>({ state: 'none' });
  const history = useHistory();

  return (
    <>
      <Button
        onClick={() => {
          setChallengeState({ state: 'none' });
          setVisiblePopup(true);
        }}
        {...buttonProps}
      />
      <Dialog
        visible={visiblePopup}
        content={
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
                    onCancel={() => {
                      resources.deleteChallenge(challengeState.challenge.id).map(() => {
                        setChallengeState({ state: 'none' });
                        setVisiblePopup(false);
                      });
                    }}
                  />
                ) : (
                  <>
                    <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
                    <Box>
                      <ChessChallengeCreator onUpdate={setGameSpecs} />
                    </Box>
                  </>
                )}
              </Box>
            )}
          />
        }
        onClose={() => setVisiblePopup(false)}
        buttons={[
          {
            label: 'Cancel',
            type: 'secondary',
            onClick: () => setVisiblePopup(false),
          },
          {
            label: 'Create Challenge',
            // full
            type: 'primary',
            onClick: () => {
              if (!gameSpecs) {
                return;
              }

              if (challengeType === 'challenge') {
                resources
                  .createChallenge({
                    type: 'private',
                    gameSpecs,
                    userId,
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
                    userId,
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
            disabled: !(faceTimeOn && gameSpecs),
          },
        ]}
      />
    </>
  );
};
