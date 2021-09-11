import { ChessHistory, SimplePGN } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGameHistoryProvided } from 'src/modules/Games/Chess/components/GameHistory';
import { spacers } from 'src/theme/spacers';
import { FenBox } from './FenBox';
import { PgnBox } from './PgnBox';
import cx from 'classnames';
import { Button } from 'src/components/Button';
import { Upload } from 'grommet-icons';
import { ImportPanel } from './ImportPanel';
import { ConfirmButton } from 'src/components/Button/ConfirmButton';
import { FloatingBox } from 'src/components/FloatingBox';

type Props = {
  onPgnImported: (pgn: SimplePGN) => void;
  analysisRecord?: {
    history: ChessHistory;
    displayedHistory: ChessHistory;
  };
};

export const AnalysisPanel: React.FC<Props> = ({ onPgnImported, analysisRecord }) => {
  const cls = useStyles();
  const [hasLoadedAnalysis, setHasLoadedAnalysis] = useState(!!analysisRecord);
  const [showImportPanel, setShowImportPanel] = useState(!hasLoadedAnalysis);

  useEffect(() => {
    const nextHasLoadedAnalysis = !!analysisRecord;

    setHasLoadedAnalysis(nextHasLoadedAnalysis);
    setShowImportPanel(!nextHasLoadedAnalysis);
  }, [analysisRecord]);

  const historyPanel = (
    <>
      {analysisRecord && (
        <>
          <div className={cx(cls.box, cls.historyContainer)}>
            <FloatingBox className={cls.historyBoxContent}>
              <ChessGameHistoryProvided />
            </FloatingBox>
          </div>
          <FenBox
            historyOrPgn={analysisRecord.displayedHistory}
            containerClassName={cx(cls.box, cls.fenBox)}
          />
          <PgnBox
            historyOrPgn={analysisRecord.history}
            containerClassName={cx(cls.box, cls.pgnBoxContainer)}
            contentClassName={cls.pgnBox}
          />
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
                content: 'Are you sure you want to Clear All the Analysis?',
                buttonsStacked: false,
              }}
              confirmButtonProps={{
                type: 'negative',
                label: 'Yes',
              }}
              onConfirmed={() => {
                onPgnImported('' as SimplePGN);
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
              icon={Upload}
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
          onImported={onPgnImported}
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