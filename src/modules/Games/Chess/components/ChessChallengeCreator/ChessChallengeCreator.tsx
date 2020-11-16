import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { ChessGameTimeLimit, metadata, ChessPrefferedColorOption, GameSpecsRecord } from 'dstnd-io';
import capitalize from 'capitalize';
import { SelectInput } from 'src/components/Input/SelectInput';

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
        <Text size="small1" className={cls.label}>
          Time Limit
        </Text>
        <SelectInput
          options={Object.keys(metadata.game.chessGameTimeLimitMsMap).map((k) => ({
            value: k,
            label: capitalize(k),
          }))}
          value={{
            label: capitalize(state.timeLimit),
            value: state.timeLimit,
          }}
          onSelect={({ value }) => {
            setState((prev) => ({
              ...prev,
              timeLimit: value as ChessGameTimeLimit,
            }));
          }}
        />
      </Box>
      <Box>
        <Text size="small1" className={cls.label}>
          Preffered Color
        </Text>
        <SelectInput
          options={metadata.game.chessGamePrefferedColorOptionList.map((k) => ({
            value: k,
            label: capitalize(k),
          }))}
          value={{
            label: capitalize(state.preferredColor),
            value: state.preferredColor,
          }}
          onSelect={({ value }) =>
            setState((prev) => ({
              ...prev,
              preferredColor: value as ChessPrefferedColorOption,
            }))
          }
        />
      </Box>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  label: {
    marginBottom: '8px',
  },
});
