import capitalize from 'capitalize';
import { ChessGameTimeLimit, metadata, Resources } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import React from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { SelectInput } from 'src/components/Input/SelectInput';
import { TextInput } from 'src/components/TextInput';
import { AnyOkAsyncResult } from 'src/lib/types';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';

type Props = {
  onSubmit: (f: FormModel) => AnyOkAsyncResult<Resources.Errors.CommonResponseErrors>;
  submitButtonProps?: Partial<Omit<ButtonProps, 'onClick'>>;
};

export type FormModel = {
  whitePlayer: string;
  blackPlayer: string;
  timeLimit: ChessGameTimeLimit;
};

const formInitialValues: FormModel = {
  blackPlayer: 'Magnus Carlsen',
  whitePlayer: 'Ian Nepomniachtchi',
  timeLimit: 'rapid120',
};

export const CreateGameForm: React.FC<Props> = ({ onSubmit, submitButtonProps }) => {
  return (
    <Form<FormModel>
      initialModel={formInitialValues}
      onSubmit={(model) =>
        onSubmit(model).mapErr(() => ({
          type: 'SubmissionGenericError',
          content: undefined,
        }))
      }
      validateOnChange={false}
      disableValidators
      render={(p) => (
        <>
          <TextInput
            label="White player"
            placeholder={p.model.whitePlayer}
            defaultValue={p.model.whitePlayer}
            onChange={(e) => p.onChange('whitePlayer', e.currentTarget.value)}
          />
          <TextInput
            label="Black player"
            placeholder={p.model.blackPlayer}
            defaultValue={p.model.blackPlayer}
            onChange={(e) => p.onChange('blackPlayer', e.currentTarget.value)}
          />
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
              label: `${capitalize(p.model.timeLimit)} (${formatTimeLimit(
                metadata.game.chessGameTimeLimitMsMap[p.model.timeLimit]
              )})`,
              value: p.model.timeLimit,
            }}
            onSelect={({ value }) => {
              p.onChange('timeLimit', value as ChessGameTimeLimit);
            }}
          />
          <br />
          <Button
            type="positive"
            label="Create"
            full
            withLoader
            onClick={p.submit}
            {...submitButtonProps}
          />
        </>
      )}
    />
  );
};
