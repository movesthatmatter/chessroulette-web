import capitalize from 'capitalize';
import { ChessGameTimeLimit, metadata, Resources } from 'chessroulette-io';
import { toISODateTime } from 'io-ts-isodatetime';
import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Hr } from 'src/components/Hr';
import { DateTimeInput } from 'src/components/Input/DateTimeInput';
import { SelectInput, SelectInputOption } from 'src/components/Input/SelectInput';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { AnyOkAsyncResult } from 'src/lib/types';
import { validator } from 'src/lib/validator';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { CreateGameForm } from 'src/modules/Relay/RelayInput/components/CreateGameForm';
import { spacers } from 'src/theme/spacers';
import { AsyncOk } from 'ts-async-results';

type Props = {
  collaborators: string[];
  onSubmit: (
    f: Omit<
      Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request,
      'curatedEventId'
    > & {
      commentators?: string[];
    }
  ) => AnyOkAsyncResult<Resources.Errors.CommonResponseErrors>;
};

export type FormModel = Pick<
  Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request,
  'label' | 'startingAt'
> & {
  commentator: string;
};

const formInitialValues: Partial<FormModel> = {};

const renderTimeLimitLabel = (l: ChessGameTimeLimit) => {
  return l === 'untimed'
    ? capitalize(l)
    : `${capitalize(l)} (${formatTimeLimit(metadata.game.chessGameTimeLimitMsMap[l])}`;
};

export const CreateCuratedEventRoundForm: React.FC<Props> = ({ onSubmit, collaborators }) => {
  const [games, setGames] = useState<
    Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request['prepareGamePropsList']
  >([]);
  const [selectedCommentators, setSelectedCommentators] = useState<string[]>([]);

  const onSubmitWithGamesAndStreamers = (model: FormModel) => {
    const commentatorsList: string[] = model.commentator
      ? model.commentator.split(' ').length > 0
        ? [...selectedCommentators, model.commentator]
        : [...selectedCommentators]
      : [...selectedCommentators];

    return onSubmit({
      label: model.label,
      startingAt: model.startingAt,
      prepareGamePropsList: games,
      commentators: [...commentatorsList],
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
        onSubmit={onSubmitWithGamesAndStreamers}
        validator={{
          label: [validator.rules.string(), validator.messages.name],
          startingAt: [validator.rules.notEmpty(), validator.messages.notEmpty],
        }}
        render={(p) => (
          <>
            <div style={{ display: 'flex' }}>
              <TextInput
                label="Round Name"
                placeholder={p.model.label}
                defaultValue={p.model.label}
                onChange={(e) => p.onChange('label', e.currentTarget.value)}
                validationError={p.errors.validationErrors?.label}
              />
              <div style={{ width: spacers.small }} />
              <DateTimeInput
                label="Starting At"
                onChange={(e) =>
                  p.onChange('startingAt', toISODateTime(new Date(e.currentTarget.value)))
                }
                validationError={p.errors.validationErrors?.startingAt}
              />
            </div>
            {games.map((g, index) => (
              <div>
                <Text size="small1">Game {index + 1}</Text>
                <br />
                <Text size="small1">{g.timeLimit}</Text>
                <br />
                <Text size="small1">{g.playersUserInfo[0].id}</Text>
                {` vs `}
                <Text size="small1">{g.playersUserInfo[1].id}</Text>
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
                        id: s.whitePlayer,
                        isGuest: false,
                        lastName: s.whitePlayer,
                        firstName: s.whitePlayer,
                        name: s.whitePlayer,
                        avatarId: '1',
                        country: undefined,
                        profilePicUrl: '',
                        username: s.whitePlayer,
                      },
                      {
                        id: s.blackPlayer,
                        isGuest: false,
                        lastName: s.blackPlayer,
                        firstName: s.blackPlayer,
                        name: s.blackPlayer,
                        avatarId: '2',
                        country: undefined,
                        profilePicUrl: '',
                        username: s.blackPlayer,
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
            <SelectInput
              label="Commentators - Collaborators"
              options={collaborators.map((k) => ({
                value: k,
                label: k,
              }))}
              onSelect={(item) => {
                const i = (item as unknown) as SelectInputOption[];
                setSelectedCommentators((prev) => [...prev, i[i.length - 1].value]);
              }}
              isMulti
            />
            <TextInput
              label="Other commentators"
              defaultValue={p.model.commentator}
              placeholder={p.model.commentator}
              onChange={(e) => p.onChange('commentator', e.currentTarget.value)}
            />
            <br />
            <Button
              type="primary"
              label="Save Round"
              full
              disabled={games.length === 0}
              withLoader
              onClick={p.submit}
            />
          </>
        )}
      />
    </>
  );
};
