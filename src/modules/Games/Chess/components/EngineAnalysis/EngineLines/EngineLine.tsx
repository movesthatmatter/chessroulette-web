import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { EngineLine as EngineLineType, EngineScore } from '../types';

type Props = {
  line: EngineLineType;
  className?: string;
};

const getScore = (score: EngineScore) => {
  if (score.unit === 'mate') {
    return 'Mate';
  }

  const normalizedScore = score.value / 100;

  return normalizedScore > 0 ? `+${normalizedScore}` : normalizedScore;
};

export const EngineLine: React.FC<Props> = (props) => {
  const cls = useStyles();

  if (props.line.type === 'other') {
    return null;
  }

  return (
    <div className={props.className}>
      <Text className={cls.text}>
        {`${getScore(props.line.score)}`} {props.line.pv}
      </Text>
    </div>
  );
};

const useStyles = createUseStyles({
  text: {
    fontSize: '14px',
    fontWeight: 300,
  },
});
