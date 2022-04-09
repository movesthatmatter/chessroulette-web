import { ChallengeRecord } from 'chessroulette-io';
import { Text } from 'src/components/Text';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';

export type AcceptChallengeProps = {
  challenge: ChallengeRecord;
};

export const AcceptChallenge: React.FC<AcceptChallengeProps> = (props) => {
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
