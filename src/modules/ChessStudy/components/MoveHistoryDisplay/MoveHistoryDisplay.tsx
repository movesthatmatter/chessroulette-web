import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Text } from 'src/components/Text';
import { MoveHistory } from '../../types';

type Props = {
  history: MoveHistory;
};

export const MoveHistoryDisplay: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {props.history.map((m) => (
        <Text>{`${m.piece}${m.from}${m.to}`}</Text>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
