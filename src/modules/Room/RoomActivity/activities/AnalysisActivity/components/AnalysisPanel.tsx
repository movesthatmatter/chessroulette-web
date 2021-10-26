import {
  ChessGameColor,
  ChessGameStateFen,
  ChessHistory,
  ChessHistoryIndex,
  SimplePGN,
} from 'dstnd-io';
import React, { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { FenBox } from './FenBox';
import { PgnBox } from './PgnBox';
import { Button } from 'src/components/Button';
import { ImportPanel, ImportPanelProps } from './ImportPanel';
import { ConfirmButton } from 'src/components/Button/ConfirmButton';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { AnalysisStateWidget, AnalysisStateWidgetProps } from './AnalysisStateWidget';

export type AnalysisPanelProps = {
  onImportedPgn: ImportPanelProps['onImportedPgn'];
  onImportedGame: ImportPanelProps['onImportedGame'];
  homeColor: ChessGameColor;
  gameAndPlayers?: AnalysisStateWidgetProps['gameAndPlayers'];
} & (
  | {
      history?: undefined;
      displayed?: undefined;
    }
  | {
      history: ChessHistory;
      displayed: {
        history: ChessHistory;
        index: ChessHistoryIndex;
        fen: ChessGameStateFen;
        pgn: SimplePGN;
      };
    }
);

const getHasLoadedAnalysis = (props: Pick<AnalysisPanelProps, 'history' | 'displayed'>) =>
  !!props.history && !!props.displayed;

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  homeColor,
  onImportedPgn,
  onImportedGame,
  gameAndPlayers,
  ...props
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();
  const [hasLoadedAnalysis, setHasLoadedAnalysis] = useState(getHasLoadedAnalysis(props));
  const [showImportPanel, setShowImportPanel] = useState(!hasLoadedAnalysis);

  useEffect(() => {
    const nextHasLoadedAnalysis = getHasLoadedAnalysis(props);

    setHasLoadedAnalysis(nextHasLoadedAnalysis);
    setShowImportPanel(!nextHasLoadedAnalysis);
  }, [props.history]);

  const historyPanel = (
    <>
      {props.history && (
        <>
          <AnalysisStateWidget
            displayedIndex={props.displayed.index}
            homeColor={homeColor}
            gameAndPlayers={gameAndPlayers}
            boxClassName={cls.containerWithHorizontalPadding}
            boxContainerClassName={cls.historyContainer}
            historyBoxContentClassName={cls.historyBoxContent}
          />
          {/* <FenBox fen={props.displayed.fen} containerClassName={cx(cls.box, cls.fenBox)} />
          <PgnBox
            pgn={props.displayed.pgn}
            containerClassName={cx(cls.box, cls.pgnBoxContainer)}
            contentClassName={cls.pgnBox}
          /> */}
          <div className={cls.box}>
            <ConfirmButton
              buttonProps={{
                label: 'Clear',
                type: theme.name === 'lightDefault' ? 'secondary' : 'negative',
                full: true,
                className: cls.button,
              }}
              dialogProps={{
                title: 'Clear Analysis',
                content: 'Are you sure you want to Clear All the Analysis?',
                buttonsStacked: false,
              }}
              confirmButtonProps={{
                type: 'negative',
                label: 'Yes',
              }}
              onConfirmed={() => {
                // Reset the Analysis
                onImportedPgn('' as SimplePGN);
                setHasLoadedAnalysis(true);
              }}
            />
            <div style={{ marginBottom: spacers.small }} />
            <Button
              label="Import"
              type="primary"
              full
              onClick={() => setShowImportPanel(true)}
              className={cls.button}
              //icon={Upload}
            />
          </div>
        </>
      )}
    </>
  );

  return (
    <div className={cls.container}>
      <div
        style={{
          display: showImportPanel ? 'flex' : 'none',
          flexDirection: 'column',
          height: '100%',
          flex: 1,
        }}
      >
        <ImportPanel
          onImportedPgn={onImportedPgn}
          onImportedGame={onImportedGame}
          hasBackButton={hasLoadedAnalysis}
          onBackButtonClicked={() => setShowImportPanel(false)}
        />
      </div>
      <div
        style={{
          display: !showImportPanel ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        }}
      >
        {historyPanel}
      </div>
    </div>
  );
};

const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    marginLeft: `-${FLOATING_SHADOW_HORIZONTAL_OFFSET}`,
    marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,
  },
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
  gamesArchiveContainer: {
    overflowY: 'hidden',
  },
  gamesArchive: {
    overflowY: 'hidden',
  },
  fenBox: {
    flex: 0,
  },
  pgnBoxContainer: {
    maxHeight: '20%',
    overflowY: 'hidden',
  },
  pgnBox: {
    overflowY: 'hidden',
  },
  pgnInputBox: {
    flex: 1,
  },
  scroller: {
    display: 'flex',
    flex: 1,
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    width: '100%',
    height: '100%',
  },
  button: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
});
