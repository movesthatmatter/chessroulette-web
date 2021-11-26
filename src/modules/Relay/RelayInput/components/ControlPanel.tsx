import capitalize from 'capitalize';
import {
  ChessGameColor,
  ChessGameTimeLimit,
  ChessMove,
  GameSpecsRecord,
  metadata,
  Resources,
} from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import React, { useState } from 'react';
import { Swap } from 'react-iconly';
import { Button, IconButton } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Form, SubmissionErrors } from 'src/components/Form';
import { SelectInput } from 'src/components/Input/SelectInput';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { delay } from 'src/lib/time';
import { Game } from 'src/modules/Games';
import { ChessGame } from 'src/modules/Games/Chess';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { CustomTheme } from 'src/theme';
import { colors } from 'src/theme/colors';
import { spacers } from 'src/theme/spacers';
import { AsyncResult } from 'ts-async-results';
import { console, Object } from 'window-or-global';

type Props = {
  relay: Resources.AllRecords.Relay.RelayedGameRecord | undefined;
  containerWidth: number;
  onAddMove: (m: ChessMove) => void;
  onSubmit: () => void;
  onAddRelay: (f: FormModel) => AsyncResult<void, any>;
  submitDisabled: boolean;
};

export type FormModel = {
  whitePlayer: string;
  blackPlayer: string;
  // specs: Game['timeLimit'];
  specs: ChessGameTimeLimit;
  label: string;
};

const formInitialValues: FormModel = {
  whitePlayer: 'Ian Nepomniachtchi',
  blackPlayer: 'Magnus Carlsen',
  specs: 'rapid120',
  label: 'WCC 2021 - Game 1',
};

const defaultTimeLimit: GameSpecsRecord['timeLimit'] = 'rapid120';

export const ControlPanel: React.FC<Props> = ({
  relay,
  containerWidth,
  onAddMove,
  onAddRelay,
  onSubmit,
  submitDisabled,
}) => {
  const cls = useStyles();
  const [showNewRelayDialog, setShowNewRelayDialog] = useState(false);
  const [orientation, setOrientation] = useState<ChessGameColor>('white');

  return (
    <>
      <div style={{}}>
        {relay?.game && (
          <>
            <div style={{ display: 'flex' }}>
              <Text style={{ marginRight: spacers.large }}>Playing :</Text>
              <Text>{relay.game.players[0].user.name.toUpperCase()}</Text>
              <div style={{ width: spacers.large }} />
              <Text>-</Text>
              <div style={{ width: spacers.large }} />
              <Text>{relay.game.players[1].user.name.toUpperCase()}</Text>
            </div>
            <br />
            <ChessGame
              size={containerWidth}
              game={gameRecordToGame(relay.game)}
              onAddMove={({ move }) => {
                onAddMove(move);
              }}
              canInteract
              playable
              playableColor={otherChessColor(relay.game.lastMoveBy || 'black')}
              turnColor={otherChessColor(relay.game.lastMoveBy || 'black')}
              orientation={orientation}
            />
            <br />
            <div>
              <IconButton
                type="primary"
                size="default"
                title="Flip Board"
                iconPrimaryColor={colors.universal.white}
                className={cls.button}
                iconType="iconly"
                icon={Swap}
                onSubmit={() => setOrientation((prev) => (prev === 'white' ? 'black' : 'white'))}
              />
            </div>
          </>
        )}
        <br />
        <Button label="Submit Move" onClick={onSubmit} disabled={submitDisabled} />
        <Button
          label="Create Another Relay"
          onClick={() => setShowNewRelayDialog(true)}
          type="positive"
        />
      </div>
      <Dialog
        visible={showNewRelayDialog}
        onClose={() => setShowNewRelayDialog(false)}
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
                      setShowNewRelayDialog(false);
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
            onClick: () => setShowNewRelayDialog(false),
            type: 'negative',
          },
        ]}
      />
    </>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {},
  button: {
    background: theme.colors.primaryLight,
    marginBottom: 0,
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
