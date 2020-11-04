import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Select, Box } from 'grommet';
import { Text } from 'src/components/Text';
import {
  ChessGameTimeLimit,
  metadata,
  ChessPrefferedColorOption,
  GameSpecsRecord,
} from 'dstnd-io';
import capitalize from 'capitalize';

type State = GameSpecsRecord;

type Props = {
  onUpdate: (state: State) => void;

  timeLimit?: ChessGameTimeLimit;
  preferredColor?: ChessPrefferedColorOption;
};

export const ChessChallengeCreator: React.FC<Props> = ({
  timeLimit = 'rapid',
  preferredColor = 'random',
  ...props
}) => {
  const cls = useStyles();
  const [state, setState] = useState<State>({
    timeLimit,
    preferredColor,
  });

  useEffect(() => {
    props.onUpdate(state);
  }, [state]);

  return (
    <div className={cls.container}>
      <Box margin={{ bottom: 'small' }}>
        <Text size="small1">Time Limit</Text>
        <Select
          size="small"
          options={Object
            .keys(metadata.game.chessGameTimeLimitMsMap)
            .map((k) => capitalize(k))
          }
          value={capitalize(state.timeLimit)}
          onChange={({ option }) =>
            setState((prev) => ({
              ...prev,
              timeLimit: String(
                option,
              ).toLocaleLowerCase() as ChessGameTimeLimit,
            }))
          }
        />
      </Box>
      <Box margin={{ bottom: 'small' }}>
        <Text size="small1">Preffered Color</Text>
        <Select
          size="small"
          options={metadata.game.chessGamePrefferedColorOptionList.map((k) =>
            capitalize(k))}
          value={capitalize(state.preferredColor)}
          onChange={({ option }) =>
            setState((prev) => ({
              ...prev,
              preferredColor: String(
                option,
              ).toLocaleLowerCase() as ChessPrefferedColorOption,
            }))
          }
        />
      </Box>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
