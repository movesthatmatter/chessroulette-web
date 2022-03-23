import { Resources } from 'chessroulette-io';
import React from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { DateTimeInput } from 'src/components/Input/DateTimeInput';
import { TextInput } from 'src/components/TextInput';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { createUseStyles } from 'src/lib/jss';
import { AnyOkAsyncResult } from 'src/lib/types';
import { validator } from 'src/lib/validator';
import { spacers } from 'src/theme/spacers';

type Props = {
  onSubmit: (f: TournamentFormModel) => AnyOkAsyncResult<any>;
};

export type TournamentFormModel = Omit<Resources.Collections.ChallongeTournaments.CreateChallongeTournament.Request, 'start_at'>;

const formInitialValues: Partial<TournamentFormModel> = {
  open_signup: 'false',
  tournament_type: 'single elimination',
};

export const CreateTournamentDialog: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Form<TournamentFormModel>
      initialModel={formInitialValues}
      onSubmit={props.onSubmit}
      validator={{
        name: [validator.rules.notEmpty(), validator.messages.notEmpty],
        url: [validator.rules.notEmpty(), validator.messages.notEmpty],
        description: [validator.rules.notEmpty(), validator.messages.notEmpty],
      }}
      disableValidators
      render={(p) => (
        <div className={cls.container}>
          <TextInput
            label="Name"
            placeholder={p.model.name}
            defaultValue={p.model.name}
            onChange={(e) => p.onChange('name', e.currentTarget.value)}
          />
          <TextInput
            label="URL"
            placeholder={p.model.url}
            defaultValue={p.model.url}
            onChange={(e) => p.onChange('url', e.currentTarget.value)}
          />
          <TextInput
            label="Descriptions"
            placeholder={p.model.description}
            defaultValue={p.model.description}
            onChange={(e) => p.onChange('description', e.currentTarget.value)}
          />
          <br/>
          <Button
            type='primary'
            label='Create Tournament'
            full
            withLoader
            onClick={p.submit}
          />
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacers.small,
  },
});
