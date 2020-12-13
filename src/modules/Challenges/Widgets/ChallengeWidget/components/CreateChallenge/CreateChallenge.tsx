import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { ChessGameTimeLimit, metadata, ChessPrefferedColorOption, GameSpecsRecord } from 'dstnd-io';
import capitalize from 'capitalize';
import { SelectInput } from 'src/components/Input/SelectInput';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import humanizeDuration from 'humanize-duration';

type State = GameSpecsRecord;

export type ChessChallengeCreatorProps = {
  onUpdate: (state: State) => void;
};

const formatTimeLimit = humanizeDuration.humanizer({
  largest: 2,
  round: true,
});

export const CreateChallenge: React.FC<ChessChallengeCreatorProps> = ({ ...props }) => {
  const cls = useStyles();
  const [state, setState] = useState<State>({
    timeLimit: 'rapid',
    preferredColor: 'random',
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
          options={Object.keys(metadata.game.chessGameTimeLimitMsMap).map((k) => {
            const timeLimit = (chessGameTimeLimitMsMap as any)[k];

            if (k === 'untimed') {
              return {
                value: k,
                label: capitalize(k),
              };
            }

            return {
              value: k,
              label: `${capitalize(k)} (${formatTimeLimit(timeLimit)})`,
            };
          })}
          value={{
            label:
              state.timeLimit === 'untimed'
                ? capitalize(state.timeLimit)
                : `${capitalize(state.timeLimit)} (${formatTimeLimit(
                    metadata.game.chessGameTimeLimitMsMap[state.timeLimit]
                  )})`,
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
            label: capitalize(k),
            value: k,
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
