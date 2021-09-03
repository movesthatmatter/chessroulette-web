import { ChessHistory, SimplePGN } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessGameHistoryProvided } from 'src/modules/Games/Chess/components/GameHistory';
import { spacers } from 'src/theme/spacers';
import { FenBox } from './FenBox';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import { PgnBox } from './PgnBox';
import { MyGamesArchive } from './MyGamesArchive';
import cx from 'classnames';
import { PgnInputBox } from './PgnInputBox';
import { Button } from 'src/components/Button';
import { Upload } from 'grommet-icons';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';

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
  const [pgn, setPgn] = useState(
    analysisRecord ? chessHistoryToSimplePgn(analysisRecord.history) : undefined
  );

  useEffect(() => {
    setHasLoadedAnalysis(!!analysisRecord);
    setShowImportPanel(!analysisRecord);
    setPgn(analysisRecord ? chessHistoryToSimplePgn(analysisRecord.history) : undefined);
  }, [analysisRecord]);

  const importPanel = (
    <>
      <LabeledFloatingBox
        label="Import Game"
        containerClassName={cx(cls.box, cls.gamesArchiveContainer)}
        floatingBoxClassName={cls.gamesArchive}
      >
        <div className={cls.scroller}>
          <div style={{ width: '100%' }}>
            <MyGamesArchive
              onSelect={(g) => {
                onPgnImported(g.pgn as SimplePGN);
                setShowImportPanel(false);
              }}
            />
          </div>
        </div>
      </LabeledFloatingBox>
      <PgnInputBox
        key={pgn}
        onImported={onPgnImported}
        containerClassName={cx(cls.box, cls.pgnInputBox)}
        contentClassName={cls.pgnBox}
      />
      {hasLoadedAnalysis && (
        <div className={cls.box}>
          <Button
            label="Back to Analysis"
            type="secondary"
            full
            onClick={() => setShowImportPanel(false)}
            className={cls.button}
          />
        </div>
      )}
    </>
  );

  const historyPanel = (
    <>
      {analysisRecord && (
        <>
          <LabeledFloatingBox
            label="History"
            containerClassName={cx(cls.box, cls.historyContainer)}
            floatingBoxClassName={cls.history}
          >
            <ChessGameHistoryProvided />
          </LabeledFloatingBox>
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
            <Button
              label="New Analysis"
              type="secondary"
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
        {importPanel}
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
  },
  history: {
    overflowY: 'hidden',
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
    marginBottom: 0,
  },
});
