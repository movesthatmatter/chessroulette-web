import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { GameRecord, SimplePGN } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { Button, IconButton } from 'src/components/Button';
import { FormPrevious } from 'grommet-icons';
import { PgnInputBox } from './PgnInputBox';
import { MyGamesArchive } from './MyGamesArchive';
import { useDebouncedCallback } from 'use-debounce/lib';
import { Err, Ok, Result } from 'ts-results';
import { getNewChessGame } from 'src/modules/Games/Chess/lib';
import { setTimeout } from 'window-or-global';

export type ImportPanelProps = {
  onImportedPgn: (pgn: SimplePGN) => void;
  onImportedGame: (game: GameRecord) => void;
} & (
  | {
      hasBackButton?: false;
      onBackButtonClicked?: () => void;
    }
  | {
      hasBackButton: true;
      onBackButtonClicked: () => void;
    }
);

export type ImportBoxState =
  | {
      selectedGame: GameRecord;
      pgnFromInput?: undefined;
    }
  | {
      selectedGame?: undefined;
      pgnFromInput:
        | {
            status: 'valid';
            input: SimplePGN;
          }
        | {
            status: 'validating' | 'invalid';
            input: string;
          };
    };

const validatePGN = (s: string): Result<SimplePGN, 'PgnNotValidError'> => {
  const instance = getNewChessGame();
  const isValid = instance.load_pgn(s);

  return isValid ? new Ok(s as SimplePGN) : new Err('PgnNotValidError');
};

export const ImportPanel: React.FC<ImportPanelProps> = (props) => {
  const cls = useStyles();
  const [state, setState] = useState<ImportBoxState>();

  const validateDebounced = useDebouncedCallback((input: string) => {
    validatePGN(input)
      .map((validPgn) => {
        setState({
          selectedGame: undefined,
          pgnFromInput: {
            status: 'valid',
            input: validPgn,
          },
        });
      })
      .mapErr(() => {
        setState({
          selectedGame: undefined,
          pgnFromInput: {
            status: 'invalid',
            input,
          },
        });
      });
  }, 250);

  const onInputChanged = useCallback((input: string) => {
    setState({
      selectedGame: undefined,
      pgnFromInput: {
        status: 'validating',
        input,
      },
    });

    validateDebounced(input);
  }, []);

  return (
    <>
      <div className={cls.scroller}>
        <div className={cls.box} style={{ width: '100%' }}>
          <MyGamesArchive
            onSelect={(game) => {
              setState({
                selectedGame: game,
                pgnFromInput: undefined,
              });
            }}
          />
        </div>
      </div>
      <PgnInputBox
        // Here show either the pgn or if it's nothing the input
        value={state?.selectedGame ? state.selectedGame.pgn : state?.pgnFromInput.input}
        onChange={onInputChanged}
        containerClassName={cx(cls.box, cls.pgnInputBox)}
        contentClassName={cls.pgnInputBox}
      />
      <div className={cx(cls.box, cls.buttonWrapper)}>
        {props.hasBackButton && (
          <IconButton
            type="secondary"
            iconType="grommet"
            icon={FormPrevious}
            onSubmit={props.onBackButtonClicked}
            className={cls.button}
          />
        )}
        <Button
          label={state ? 'Import' : 'PGN Invalid'}
          type="primary"
          disabled={!state || state.pgnFromInput?.status === 'invalid'}
          full
          isLoading={state?.pgnFromInput?.status === 'validating'}
          onClick={() => {
            if (!state) {
              return;
            }

            if (state?.selectedGame) {
              props.onImportedGame(state.selectedGame);
            } else if (state.pgnFromInput.status === 'valid') {
              props.onImportedPgn(state.pgnFromInput.input);
            }

            setTimeout(() => {
              // Wait a little to clear the imported state!
              setState(undefined);
            }, 300);
          }}
          containerClassName={cls.button}
          className={cls.noMarging}
        />
      </div>
    </>
  );
};

const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

const useStyles = createUseStyles((theme) => ({
  // TODO: Have a centralized box class since it's used in other places
  box: {
    paddingLeft: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingBottom: FLOATING_SHADOW_BOTTOM_OFFSET,
    marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,

    paddingTop: spacers.default,

    '&:first-child': {
      paddingTop: 0,
    },

    '&:last-child': {
      marginBottom: 0,
    },
  },
  boxHorizontalPadding: {
    paddingLeft: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
  },
  importGameLabel: {
    paddingBottom: spacers.small,
  },
  fenBox: {
    flex: 0,
  },
  pgnBoxContainer: {
    maxHeight: '20%',
    overflowY: 'hidden',
  },
  pgnInputBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
  },
  scroller: {
    display: 'flex',
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    width: '100%',
    height: '100%',
  },
  button: {
    marginBottom: 0,
    marginLeft: spacers.small,

    '&:first-child': {
      marginLeft: 0,
    },
  },
  noMarging: {
    marginBottom: 0,
  },
  buttonWrapper: {
    display: 'flex',
  },
}));
