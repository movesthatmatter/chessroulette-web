import capitalize from 'capitalize';
import { ChessGameTimeLimit, metadata, Resources } from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Hr } from 'src/components/Hr';
import { DateTimeInput } from 'src/components/Input/DateTimeInput';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { AnyOkAsyncResult } from 'src/lib/types';
import { validator } from 'src/lib/validator';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { CreateGameForm } from 'src/modules/Relay/RelayInput/components/CreateGameForm';
import { getUserDisplayName } from 'src/modules/User';
import { AsyncOk } from 'ts-async-results';

type Props = {
  onSubmit: (
    f: Omit<Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request, 'curatedEventId'>
  ) => AnyOkAsyncResult<Resources.Errors.CommonResponseErrors>;
};

export type FormModel = Pick<
  Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request,
  'label' | 'startingAt'
>;

const formInitialValues: Partial<FormModel> = {};

const renderTimeLimitLabel = (l: ChessGameTimeLimit) => {
  return l === 'untimed'
    ? capitalize(l)
    : `${capitalize(l)} (${formatTimeLimit(metadata.game.chessGameTimeLimitMsMap[l])}`;
};

export const CreateCuratedEventRoundForm: React.FC<Props> = ({ onSubmit }) => {
  const cls = useStyles();
  const [games, setGames] = useState<
    Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request['prepareGamePropsList']
  >([]);

  const onSubmitWithGames = (model: FormModel) => {
    return onSubmit({
      ...model,
      prepareGamePropsList: games,
    }).mapErr(() => {
      return {
        type: 'SubmissionGenericError',
        content: undefined,
      } as const;
    });
  };

  return (
    <>
      <Form<FormModel>
        initialModel={formInitialValues}
        onSubmit={onSubmitWithGames}
        validator={{
          label: [validator.rules.string(), validator.messages.name],
          startingAt: [validator.rules.notEmpty(), validator.messages.notEmpty],
        }}
        render={(p) => (
          <>
            <TextInput
              label="Round Name"
              placeholder={p.model.label}
              defaultValue={p.model.label}
              onChange={(e) => p.onChange('label', e.currentTarget.value)}
              validationError={p.errors.validationErrors?.label}
            />
            <DateTimeInput
              label="Starting At"
              onChange={(e) =>
                p.onChange('startingAt', toISODateTime(new Date(e.currentTarget.value)))
              }
              validationError={p.errors.validationErrors?.startingAt}
            />
            {games.map((g, index) => (
              <div>
                <Text size="subtitle2">Game {index + 1}</Text>
                <br />
                <Text>{g.timeLimit}</Text>
                <br />
                <Text>{getUserDisplayName(g.playersUserInfo[0])}</Text>
                {` vs `}
                <Text>{getUserDisplayName(g.playersUserInfo[1])}</Text>
              </div>
            ))}
            <br />
            <Hr text={`Add Game ${games.length + 1}`} />
            <br />
            <CreateGameForm
              onSubmit={(s) => {
                setGames((prev) => [
                  ...prev,
                  {
                    timeLimit: s.timeLimit,
                    playersUserInfo: [
                      {
                        isGuest: true,
                        id: 'white',
                        lastName: '',
                        firstName: '',
                        avatarId: '5',
                        name: s.whitePlayer,
                      },
                      {
                        isGuest: true,
                        id: 'black',
                        lastName: '',
                        firstName: '',
                        avatarId: '3',
                        name: s.blackPlayer,
                      },
                    ],
                    preferredColor: 'white',
                  },
                ]);

                return AsyncOk.EMPTY;
              }}
              submitButtonProps={{
                label: 'Save Game',
                type: 'secondary',
                full: false,
              }}
            />
            <br />
            <Button type="primary" label="Save Round" full disabled={games.length === 0} withLoader onClick={p.submit} />
          </>
        )}
      />
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
