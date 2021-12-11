import capitalize from 'capitalize';
import { ChessGameTimeLimit, metadata, Resources } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { boolean } from 'io-ts';
import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { Form, FormError, SubmissionErrors } from 'src/components/Form';
import { SelectInput, SelectInputOption } from 'src/components/Input/SelectInput';
import { TextInput } from 'src/components/TextInput';
import { AnyOkAsyncResult } from 'src/lib/types';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { AsyncOk, AsyncResult } from 'ts-async-results';
import { verifyUsernames } from '../resource';

type Props = {
  onSubmit: (f: FormModel) => AsyncResult<void, SubmissionErrors<FormModel>>;
  submitButtonProps?: Partial<Omit<ButtonProps, 'onClick'>>;
};

export type FormModel = {
  whitePlayer: string;
  blackPlayer: string;
  timeLimit: ChessGameTimeLimit;
};

const formInitialValues: FormModel = {
  blackPlayer: '',
  whitePlayer: '',
  timeLimit: 'rapid15',
};

export const CreateGameForm: React.FC<Props> = ({ onSubmit, submitButtonProps }) => {
  const [validUsername, setValidUsername] = useState<{white: boolean; black: boolean}>({
    white: true,
    black: true
  })

  return (
    <Form<FormModel>
      initialModel={formInitialValues}
      onSubmit={(model) => {
          return verifyUsernames({
            usernameWhite: model.whitePlayer,
            usernameBlack: model.blackPlayer
          })
          .mapErr((e) => ({
            type: 'SubmissionGenericError',
            content: undefined
          } as SubmissionErrors<FormModel>))
          .map(res => {
            setValidUsername({
              white: res.white.result,
              black: res.black.result
            })
            if (res.black.result && res.white.result) {
              onSubmit({
                ...model,
                whitePlayer: res.white.id,
                blackPlayer: res.black.id
              })
            }
          })
      }}
      validateOnChange={false}
      disableValidators
      render={(p) => (
        <>
          <TextInput
            label="White player username"
            placeholder={p.model.whitePlayer}
            defaultValue={p.model.whitePlayer}
            onChange={(e) => p.onChange('whitePlayer', e.currentTarget.value)}
          />
          {!validUsername.white && <FormError message='Inexistent Username'/>}
          <TextInput
            label="Black player username"
            placeholder={p.model.blackPlayer}
            defaultValue={p.model.blackPlayer}
            onChange={(e) => p.onChange('blackPlayer', e.currentTarget.value)}
          />
          {!validUsername.black && <FormError message='Inexistent Username'/>}
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
            onSelect={(item) => {
              p.onChange('timeLimit', (item as SelectInputOption).value as ChessGameTimeLimit);
            }}
          />
          <br />
          <div style={{display: 'flex', justifyContent:'center'}}>
          <Button
            type="positive"
            label="Create"
            full
            withLoader
            onClick={p.submit}
            {...submitButtonProps}
          />
          </div>
        </>
      )}
    />
  );
};
