import { ChallengeRecord } from 'dstnd-io';
import { Text } from 'src/components/Text';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  challenge: ChallengeRecord;
};

export const AcceptChallenge: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.textContainer}>
      <Text>
        You've been challenged to a <b>{props.challenge.gameSpecs.timeLimit}</b> game!
      </Text>
    </div>
  );
};

const useStyles = createUseStyles({
  textContainer: {
    textAlign: 'center',
  },
});
