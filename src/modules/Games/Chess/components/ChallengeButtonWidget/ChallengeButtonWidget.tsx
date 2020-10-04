import React, { useState } from 'react';
import { Box, Layer } from 'grommet';
import { ChessChallengeCreator } from 'src/modules/Games/Chess/components/ChessChallengeCreator';
import { ChallengeRecord, GameSpecsRecord, RoomRecord, UserRecord } from 'dstnd-io';
import { Button } from 'src/components/Button';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PendingChallenge } from './PendingChallenge';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';

type Props = {
  buttonLabel: string;
  type: 'challenge' | 'quickPairing';
  userId: UserRecord['id'];
};

type ChallengeState = {
  state: 'none',
} | {
  state: 'pending',
  challenge: ChallengeRecord,
} | {
  state: 'accepted',
  room: RoomRecord,
};

export const ChallengeButtonWidget: React.FC<Props> = ({
  ...props
}) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord | undefined>(undefined);
  const [challengeState, setChallengeState] = useState<ChallengeState>({ state: 'none' });
  const history = useHistory();

  return (
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
      render={() => (
        <Box margin="small">
          <Button
            onClick={() => {
              setChallengeState({ state: 'none' });
              setVisiblePopup(true);
            }}
            size="medium"
            label={props.buttonLabel}
          />
          {visiblePopup && (
            <Layer position="center">
              <Box pad="medium" gap="small" width="medium">
                {challengeState.state === 'pending' ? (
                  <PendingChallenge
                    challenge={challengeState.challenge}
                    onCancel={() => {
                      resources
                        .deleteChallenge(challengeState.challenge.id)
                        .map(() => {
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
                    <Button
                      type="button"
                      label="Create Challenge"
                      primary
                      onClick={() => {
                        if (!gameSpecs) {
                          return;
                        }

                        if (props.type === 'challenge') {
                          resources
                            .createChallenge({
                              type: 'private',
                              gameSpecs,
                              userId: props.userId,
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
                              userId: props.userId,
                              gameSpecs,
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
                      }}
                      disabled={!(faceTimeOn && gameSpecs)}
                      // margin={{ bottom: 'small' }}
                    />
                    <Button
                      type="button"
                      label="Cancel"
                      onClick={() => setVisiblePopup(false)}
                      margin={{ top: 'small' }}
                    />
                  </>
                )}
              </Box>
            </Layer>
          )}
        </Box>
      )}
    />
  );
};
