import capitalize from 'capitalize';
import { ChessGameTimeLimit, GameSpecsRecord, metadata } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import React from 'react';
import { Button } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { SelectInput } from 'src/components/Input/SelectInput';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { delay } from 'src/lib/time';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { AsyncResult } from 'ts-async-results';

type Props = {
  onAddRelay: (f: FormModel) => AsyncResult<void, any>;
  onClose :() => void;
  visible: boolean;
};

export type FormModel = {
  whitePlayer: string;
  blackPlayer: string;
  // specs: Game['timeLimit'];
  specs: ChessGameTimeLimit;
  label: string;
};

const defaultTimeLimit: GameSpecsRecord['timeLimit'] = 'rapid120';

const formInitialValues: FormModel = {
  whitePlayer: 'Ian Nepomniachtchi',
  blackPlayer: 'Magnus Carlsen',
  specs: 'rapid120',
  label: 'WCC 2021 - Game 3',
};

export const NewRelayDialog: React.FC<Props> = ({
  onAddRelay, onClose, visible
}) => {
  const cls = useStyles();

  return (
    <Dialog
        visible={visible}
        onClose={onClose}
        content={
          <Form<FormModel>
            initialModel={formInitialValues}
            onSubmit={onAddRelay}
            validateOnChange={false}
            disableValidators
            render={(p) => (
              <>
                <TextInput
                  label="Game Label"
                  placeholder={p.model.label}
                  defaultValue={p.model.label}
                  onChange={(e) => p.onChange('label', e.currentTarget.value)}
                />
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
                    label: `${capitalize(p.model.specs)} (${formatTimeLimit(
                      metadata.game.chessGameTimeLimitMsMap[p.model.specs]
                    )})`,
                    value: p.model.specs,
                  }}
                  onSelect={({ value }) => {
                    p.onChange('specs', value as ChessGameTimeLimit);
                  }}
                />
                <br />
                <Button
                  type="positive"
                  label="Create"
                  full
                  withLoader
                  onClick={() => {
                    p.submit();
                    (async () => {
                      await delay(500);
                      onClose();
                    })();
                  }}
                />
              </>
            )}
          />
        }
        hasCloseButton
        buttons={[
          {
            label: 'Cancel',
            onClick: () => onClose(),
            type: 'negative',
          },
        ]}
      />
  );
};

const useStyles = createUseStyles({
  container: {},
});