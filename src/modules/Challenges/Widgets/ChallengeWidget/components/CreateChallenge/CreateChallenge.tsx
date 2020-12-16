import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import {
  ChessGameTimeLimit,
  metadata,
  GameSpecsRecord,
  ChallengeRecord,
  ChessGameColor,
} from 'dstnd-io';
import capitalize from 'capitalize';
import { SelectInput } from 'src/components/Input/SelectInput';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import humanizeDuration from 'humanize-duration';

export type CreateChallengeProps = {
  gameSpecs: ChallengeRecord['gameSpecs'];
  onUpdated: (gs: GameSpecsRecord) => void;
};

const formatTimeLimit = humanizeDuration.humanizer({
  largest: 2,
  round: true,
});

export const CreateChallenge: React.FC<CreateChallengeProps> = ({ gameSpecs, onUpdated }) => {
  const cls = useStyles();

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
              gameSpecs.timeLimit === 'untimed'
                ? capitalize(gameSpecs.timeLimit)
                : `${capitalize(gameSpecs.timeLimit)} (${formatTimeLimit(
                    metadata.game.chessGameTimeLimitMsMap[gameSpecs.timeLimit]
                  )})`,
            value: gameSpecs.timeLimit,
          }}
          onSelect={({ value }) => {
            onUpdated({
              ...gameSpecs,
              timeLimit: value as ChessGameTimeLimit,
            });
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
            label: capitalize(gameSpecs.preferredColor),
            value: gameSpecs.preferredColor,
          }}
          onSelect={({ value }) => {
            onUpdated({
              ...gameSpecs,
              preferredColor: value as ChessGameColor,
            });
          }}
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
