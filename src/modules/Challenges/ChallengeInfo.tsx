import { ChallengeRecord, UserInfoRecord } from 'dstnd-io';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import React, { useState } from 'react';
import { ConfirmationButton } from 'src/components/ConfirmationButton';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  challenge: ChallengeRecord;
  user: UserInfoRecord;
  onAccept: () => void;
};

export const ChallengeInfo: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [faceTimeOn, setFaceTimeOn] = useState(false);

  return (
    <Box className={cls.container} pad="medium">
      <Text>
        You've been challenged to a <b>{props.challenge.gameSpecs.timeLimit}</b> game!
      </Text>
      <ConfirmationButton
        label="Accept Challenge"
        onSubmit={() => props.onAccept()}
        canSubmit={faceTimeOn}
        submitButtonLabel="Start"
        confirmationPopupContent={(
          <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
        )}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    background: 'white'
  },
});