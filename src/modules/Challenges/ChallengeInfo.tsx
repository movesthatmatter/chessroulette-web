import { ChallengeRecord, RoomRecord, UserInfoRecord } from 'dstnd-io';
import { Box, Text } from 'grommet';
import React from 'react';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { resources } from 'src/resources';

type Props = {
  challenge: ChallengeRecord;
  user: UserInfoRecord;
  onAccept: () => void;
};

export const ChallengeInfo: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Box className={cls.container} pad="medium">
      <Text margin={{  bottom: 'small' }}>
        You've been challenged to a <b>{props.challenge.gameSpecs.timeLimit}</b> game!
      </Text>
      <Button 
        label="Accept Challenge"
        onClick={() => props.onAccept()}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    background: 'white'
  },
});