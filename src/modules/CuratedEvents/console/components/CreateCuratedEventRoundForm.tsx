import capitalize from 'capitalize';
import { ChessGameTimeLimit, metadata, Resources } from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Hr } from 'src/components/Hr';
import { DateTimeInput } from 'src/components/Input/DateTimeInput';
import { SelectInput } from 'src/components/Input/SelectInput';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { AnyOkAsyncResult } from 'src/lib/types';
import { validator } from 'src/lib/validator';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { CreateGameForm } from 'src/modules/Relay/RelayInput/components/CreateGameForm';
import { AsyncOk } from 'ts-async-results';

type Props = {
  commentators: string[];
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
>;

const formInitialValues: Partial<FormModel> = {};

const renderTimeLimitLabel = (l: ChessGameTimeLimit) => {
  return l === 'untimed'
    ? capitalize(l)
    : `${capitalize(l)} (${formatTimeLimit(metadata.game.chessGameTimeLimitMsMap[l])}`;
};

export const CreateCuratedEventRoundForm: React.FC<Props> = ({ onSubmit, commentators }) => {
  const [games, setGames] = useState<
    Resources.Collections.CuratedEvents.CreateCuratedEventRound.Request['prepareGamePropsList']
  >([]);
  const [selectedCommentators, setSelectedCommentators] = useState<string[]>([]);

  const onSubmitWithGamesAndStreamers = (model: FormModel) => {
    return onSubmit({
      ...model,
      prepareGamePropsList: games,
      ...(selectedCommentators.length > 0 ? { commentators: selectedCommentators } : {}),
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
                <Text>{g.playersUserInfo[0].id}</Text>
                {` vs `}
                <Text>{g.playersUserInfo[1].id}</Text>
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
              label="Streamers"
              options={commentators.map((k) => ({
                value: k,
                label: k,
              }))}
              onSelect={({ value }) => {
                setSelectedCommentators((prev) => [...prev, value]);
              }}
              isMulti
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
