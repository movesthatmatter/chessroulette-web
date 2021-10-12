import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { GameRecord, SimplePGN } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { MyGamesArchive } from './MyGamesArchive';
import { PgnInputBox } from './PgnInputBox';
import { Button, IconButton } from 'src/components/Button';
import { FormPrevious } from 'grommet-icons';
import { CustomTheme } from 'src/theme';

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

export const ImportPanel: React.FC<ImportPanelProps> = (props) => {
  const cls = useStyles();
  const [pgn, setPgn] = useState<SimplePGN>();
  const [selectedGame, setSelectedGame] = useState<GameRecord>();
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (selectedGame?.pgn) {
      setPgn(selectedGame.pgn as SimplePGN);
    }
  }, [selectedGame]);

  return (
    <>
      <div style={{ overflowY: 'hidden' }}>
        {/* <div className={cx(cls.boxHorizontalPadding, cls.importGameLabel)}>
          <Text size="small2">Import a Previous Game</Text>
        </div> */}
        <div className={cls.scroller}>
          <div
            className={cx(cls.box)}
            style={{
              width: '100%',
            }}
          >
            <MyGamesArchive onSelect={setSelectedGame} />
          </div>
        </div>
      </div>
      <PgnInputBox
        // Here show either the pgn or if it's nothing the input
        value={pgn}
        onChange={(s) => {
          setIsValidating(s.isLoading);

          if (s.isLoading) {
            return;
          }

          if (s.isValid) {
            setPgn(s.pgn);
            return;
          }

          setPgn(undefined);
          setSelectedGame(undefined);
        }}
        containerClassName={cx(cls.box, cls.pgnInputBox)}
        contentClassName={cls.pgnInputBox}
      />
      <div className={cx(cls.box, cls.buttonWrapper)}>
        {props.hasBackButton && (
          <IconButton
            type="secondary"
            iconType="grommet"
            icon={FormPrevious}
            onSubmit={() => props.onBackButtonClicked()}
            className={cx(cls.button, cls.iconButton)}
          />
        )}
        <Button
          label={pgn ? 'Import' : 'PGN Invalid'}
          type="primary"
          disabled={!pgn}
          full
          isLoading={isValidating}
          onClick={() => {
            if (!pgn) {
              return;
            }

            if (selectedGame?.pgn === pgn) {
              props.onImportedGame(selectedGame);
            } else {
              props.onImportedPgn(pgn);
            }

            setPgn(undefined);
            setSelectedGame(undefined);
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

const useStyles = createUseStyles<CustomTheme>((theme) => ({
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
  iconButton: {
    background: theme.button.backgrounds.primary,
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
