import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { AsyncResult } from 'ts-async-results';
import { console } from 'window-or-global';
import { getTimeInMinutesAndSeconds } from '../utils';

type FormModel = {
  blackMinutes: string;
  blackSeconds: string;
  whiteMinutes: string;
  whiteSeconds: string;
};

type Props = {
  game: Game;
  onClose: () => void;
  onSubmit: (f: FormModel) => AsyncResult<void, any>;
  visible: boolean;
};

export const TimerAdjustmentDialog: React.FC<Props> = ({ game, onClose, onSubmit, visible }) => {
  const cls = useStyles();

  const initialFormValues = {
    whiteMinutes: getTimeInMinutesAndSeconds(game.timeLeft.white).minutes.toString(),
    whiteSeconds: getTimeInMinutesAndSeconds(game.timeLeft.white).seconds.toString(),
    blackMinutes: getTimeInMinutesAndSeconds(game.timeLeft.black).minutes.toString(),
    blackSeconds: getTimeInMinutesAndSeconds(game.timeLeft.black).seconds.toString(),
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      hasCloseButton
      content={
        <Form<FormModel>
          initialModel={initialFormValues}
          validateOnChange={false}
          disableValidators
          onSubmit={onSubmit}
          render={(p) => (
            <div className={cls.dialog}>
              <Text>Time Left</Text>
              <br />
              <Text>Black Player :</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextInput
                  label="Minutes"
                  type="number"
                  defaultValue={p.model.blackMinutes}
                  placeholder={p.model.blackMinutes}
                  onChange={(e) => p.onChange('blackMinutes', e.currentTarget.value)}
                />
                <TextInput
                  label="seconds"
                  type="number"
                  defaultValue={p.model.blackSeconds}
                  placeholder={p.model.blackSeconds}
                  onChange={(e) => p.onChange('blackSeconds', e.currentTarget.value)}
                />
              </div>
              <Text>White Player :</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextInput
                  label="Minutes"
                  type="number"
                  defaultValue={p.model.whiteMinutes}
                  placeholder={p.model.whiteSeconds}
                  onChange={(e) => p.onChange('whiteMinutes', e.currentTarget.value)}
                />
                <TextInput
                  label="seconds"
                  defaultValue={p.model.whiteSeconds}
                  placeholder={p.model.whiteSeconds}
                  type="number"
                  onChange={(e) => p.onChange('whiteSeconds', e.currentTarget.value)}
                />
              </div>
              <Button
                type="positive"
                label="Submit"
                onClick={() => {
                  p.submit();
                }}
              />
            </div>
          )}
        />
      }
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  dialog: {
    display: 'flex',
    flexDirection: 'column',
  },
});
