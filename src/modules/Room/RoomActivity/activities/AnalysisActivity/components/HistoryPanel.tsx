import {
  AnalysisRecord,
  ChessGameColor,
  ChessGameStateFen,
  ChessHistory,
  ChessHistoryIndex,
  SimplePGN,
} from 'dstnd-io';
import React, { useMemo } from 'react';
import { Button } from 'src/components/Button';
import { ConfirmButton } from 'src/components/Button/ConfirmButton';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { AnalysisStateWidget, AnalysisStateWidgetProps } from './AnalysisStateWidget';
import cx from 'classnames';
import { PgnBox } from './PgnBox';
import { EngineAnalysisBox } from './EngineAnalysisBox';
import { useEngineAnalysis } from 'src/modules/Games/Chess/components/EngineAnalysis';
import { EngineAnalysisBoxWidget } from './EngineAnalysisBoxWidget';

type Props = {
  analysisId: AnalysisRecord['id'];
  homeColor: ChessGameColor;
  gameAndPlayers?: AnalysisStateWidgetProps['gameAndPlayers'];
  displayed: {
    history: ChessHistory;
    index: ChessHistoryIndex;
    fen: ChessGameStateFen;
    pgn: SimplePGN;
  };
  onImportButtonPress: () => void;
  onClearButtonPress: () => void;
  useEngine?: boolean;
};

export const HistoryPanel: React.FC<Props> = ({
  analysisId,
  homeColor,
  displayed,
  gameAndPlayers,
  onImportButtonPress,
  onClearButtonPress,
  useEngine = false,
}) => {
  const cls = useStyles();

  const displayedAsEngineGame = useMemo(() => {
    if (gameAndPlayers) {
      return {
        id: gameAndPlayers.game.id,
        pgn: displayed.pgn,
      } as const;
    }

    return {
      id: analysisId,
      pgn: displayed.pgn,
    };
  }, [analysisId, displayed.pgn, gameAndPlayers?.game.id]);

  return (
    <>
      <AnalysisStateWidget
        displayedIndex={displayed.index}
        homeColor={homeColor}
        gameAndPlayers={gameAndPlayers}
        boxClassName={cls.containerWithHorizontalPadding}
        boxContainerClassName={cls.historyContainer}
        historyBoxContentClassName={cls.historyBoxContent}
      />
      {useEngine ? (
        <EngineAnalysisBoxWidget
          engineGame={displayedAsEngineGame}
          containerClassName={cx(cls.box, cls.engineAnalysisContainer)}
        />
      ) : (
        <PgnBox
          pgn={displayed.pgn}
          containerClassName={cx(cls.box, cls.pgnBoxContainer)}
          contentClassName={cls.pgnBox}
        />
      )}

      {/* <FenBox fen={props.displayed.fen} containerClassName={cx(cls.box, cls.fenBox)} /> */}

      <div className={cls.box}>
        <ConfirmButton
          buttonProps={{
            label: 'Clear',
            type: 'secondary',
            full: true,
            className: cls.button,
          }}
          dialogProps={{
            title: 'Clear Analysis',
            content: 'Are you sure you want to clear the analysis?',
            buttonsStacked: false,
          }}
          cancelButtonProps={{
            type: 'secondary',
          }}
          confirmButtonProps={{
            type: 'negative',
            label: 'Yes',
          }}
          onConfirmed={onClearButtonPress}
          // onConfirmed={() => {

          //   // Reset the Analysis
          //   // onImportedPgn('' as SimplePGN);
          //   // setHasLoadedAnalysis(true);
          // }}
        />
        <div style={{ marginBottom: spacers.small }} />
        <Button
          label="Import"
          type="primary"
          full
          // onClick={() => setShowImportPanel(true)}
          onClick={onImportButtonPress}
          className={cls.button}
        />
      </div>
    </>
  );
};

const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

const useStyles = createUseStyles({
  containerWithHorizontalPadding: {
    paddingLeft: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
  },
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
  historyContainer: {
    overflowY: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  historyBoxContent: {
    overflowY: 'hidden',
    flex: 1,
  },
  pgnBoxContainer: {
    maxHeight: '20%',
    overflowY: 'hidden',
  },
  engineAnalysisContainer: {
    // flex: 0,
    overflowY: 'hidden',
  },
  pgnBox: {
    overflowY: 'hidden',
  },
  button: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
});
