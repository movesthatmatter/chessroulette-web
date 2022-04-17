import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  ChessGameTimeLimit,
  metadata,
  GameSpecsRecord,
  ChallengeRecord,
  ChessGameColor,
} from 'chessroulette-io';
import capitalize from 'capitalize';
import { SelectInput } from 'src/components/Input/SelectInput';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';
import humanizeDuration from 'humanize-duration';
import { spacers } from 'src/theme/spacers';

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
      <div className={cls.top}>
        <SelectInput
          label="Time Limit"
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
      </div>
      <div>
        <SelectInput
          label="Preferred Color"
          options={metadata.game.chessGamePrefferedColorOptionList.map((k) => ({
            label: capitalize(k),
            value: k,
          }))}
          value={{
            label: capitalize(gameSpecs.preferredColor || ''),
            value: gameSpecs.preferredColor || '',
          }}
          onSelect={({ value }) => {
            onUpdated({
              ...gameSpecs,
              preferredColor: value as ChessGameColor,
            });
          }}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  top: {
    marginBottom: spacers.default,
  },
});
