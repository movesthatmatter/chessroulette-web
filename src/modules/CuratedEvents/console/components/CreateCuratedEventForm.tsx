import React from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import { AsyncResult } from 'ts-async-results';
import { Resources } from 'dstnd-io';

type Props = {
  onSubmit: (f: FormModel) => AsyncResult<any, any>;
};

export type FormModel = Resources.Collections.CuratedEvents.CreateCuratedEvent.Request;

const formInitialValues: Partial<FormModel> = {
  type: 'externalTournament',
};

export const CreateCuratedEventForm: React.FC<Props> = ({ onSubmit }) => {
  const cls = useStyles();

  return (
    <Form<FormModel>
      initialModel={formInitialValues}
      onSubmit={onSubmit}
      validator={{
        name: [validator.rules.notEmpty(), validator.messages.name],
      }}
      // validateOnChange={false}
      disableValidators
      render={(p) => (
        <>
          <TextInput
            label="Event Name"
            placeholder={p.model.name}
            defaultValue={p.model.name}
            onChange={(e) => p.onChange('name', e.currentTarget.value)}
          />
          <br />
          <Button type="primary" label="Create" full withLoader onClick={p.submit} />
        </>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});
