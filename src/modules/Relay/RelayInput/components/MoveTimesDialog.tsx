import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { spacers } from 'src/theme/spacers';
import { AsyncResult } from 'ts-async-results';
import { getMinutesAndSecondsFromTimeLeft, getTimeInMinutesAndSeconds } from '../utils';

type FormModel = {
  minutes: string;
  seconds: string;
};

type Props = {
  timeLeft: number;
  onClose: () => void;
  onSubmit: (f: FormModel) => AsyncResult<void, any>;
  visible: boolean;
};

export const MoveTimesDialog: React.FC<Props> = ({ timeLeft, onClose, onSubmit, visible }) => {
  const cls = useStyles();

  const initialFormValues = {
    minutes: getMinutesAndSecondsFromTimeLeft(timeLeft).minutes.toString(),
    seconds: getMinutesAndSecondsFromTimeLeft(timeLeft).seconds.toString(),
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextInput
                  label="Minutes"
                  type="number"
                  defaultValue={p.model.minutes}
                  onChange={(e) => {
                    p.onChange('minutes', e.currentTarget.value);
                  }}
                />
                <div style={{ height: spacers.default }} />
                <TextInput
                  label="seconds"
                  type="number"
                  defaultValue={p.model.seconds}
                  onChange={(e) => {
                    p.onChange('seconds', e.currentTarget.value);
                  }}
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
