import { ChallengeRecord, UserInfoRecord } from 'dstnd-io';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import React, { useState } from 'react';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { createUseStyles } from 'src/lib/jss';
import { Dialog } from 'src/components/Dialog/Dialog';

type Props = {
  challenge: ChallengeRecord;
  user: UserInfoRecord;
  onAccept: () => void;
  onDeny: () => void;
};

export const ChallengeInfo: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [faceTimeOn, setFaceTimeOn] = useState(false);

  return (
    <Dialog
      visible
      hasCloseButton={false}
      content={
        <>
          <Box margin={{bottom: 'medium'}} className={cls.textContainer}>
            <Text>
              You've been challenged to a <b>{props.challenge.gameSpecs.timeLimit}</b> game!
            </Text>
          </Box>
          <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
        </>
      }
      buttons={[
        {
          label: 'Deny',
          onClick: () => {
            props.onDeny();
          },
          type: 'secondary',
        },
        {
          label: 'Accept',
          onClick: () => {
            props.onAccept();;
          },
          disabled: !faceTimeOn,
        },
      ]}
    />
  );
};

const useStyles = createUseStyles({
  textContainer: {
    textAlign: 'center',
  },
});
