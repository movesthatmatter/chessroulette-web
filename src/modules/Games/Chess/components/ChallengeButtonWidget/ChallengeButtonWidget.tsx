import React, { useEffect, useState } from 'react';
import { Box, Layer } from 'grommet';
import { ChessChallengeCreator } from 'src/modules/Games/Chess/components/ChessChallengeCreator';
import { ChallengeRecord, GameSpecsRecord, UserRecord } from 'dstnd-io';
import { Button } from 'src/components/Button';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { ClipboardCopy } from 'src/components/CipboardCopy';
import { PendingChallenge } from './PendingChallenge';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';

type Props = {
  // onSubmit?: (gameSpecs: GameSpecsRecord) => void;
  buttonLabel: string;
  type: ChallengeRecord['type'];
  userId: UserRecord['id'];
};

export const ChallengeButtonWidget: React.FC<Props> = ({
  // onSubmit = noop,
  ...props
}) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord | undefined>(undefined);
  const [pendingChallenge, setPendingChallenge] = useState<ChallengeRecord | undefined>(undefined);
  const history = useHistory();

  // const submit = () => {
  //   if (!gameSpecs) {
  //     return;
  //   }

  //   onSubmit(gameSpecs);
  // };
  // useEffect(() => {
  //   return () => {
  //     if (pendingChallenge) {
        
  //     }
  //   }
  // }, []);

  // const cancelPendingChalleng = () => {

  // }

  return (
    <Box margin="small">
      <Button
        onClick={() => {
          setPendingChallenge(undefined);
          setVisiblePopup(true);
        }}
        size="medium"
        label={props.buttonLabel}
      />
      {visiblePopup && (
        <Layer position="center">
          <Box pad="medium" gap="small" width="medium">
            {pendingChallenge ? (
              <PendingChallenge
                userId={props.userId}
                challenge={pendingChallenge}
                onCancel={() => {
                  setPendingChallenge(undefined);
                  setVisiblePopup(false);
                }}
                onAccepted={({ room }) => {
                  history.push(toRoomUrlPath(room));
                  // toRoomUrlPath
                  // console.log('challenge accepted. Going to redirect', c);
                }}
              />
              // <SocketConsumer render={() => (
              //   <>
              //     <Box pad="medium" gap="small" width="medium">
              //       Send this url to a friend
              //       <ClipboardCopy value={window.location.href} />
              //       <Button
              //         type="button"
              //         label="Cancel"
              //         onClick={() => {
              //           resources
              //             .deleteChallenge(pendingChallenge.id)
              //             .map(() => {
              //               setPendingChallenge(undefined);
              //               setVisiblePopup(false);
              //             });
              //         }} 
              //       />
              //     </Box>
                  
              //   </>
              // )}
              // />
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

                    resources
                      .createChallenge({
                        type: props.type,
                        gameSpecs,
                        userId: props.userId,
                      })
                      .map(setPendingChallenge);
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
  );
};
