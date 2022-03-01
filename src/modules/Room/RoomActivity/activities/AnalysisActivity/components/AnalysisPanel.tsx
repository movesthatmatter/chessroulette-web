import {
  AnalysisRecord,
  ChessGameColor,
  ChessGameStateFen,
  ChessHistory,
  ChessHistoryIndex,
  SimplePGN,
} from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { ImportPanel, ImportPanelProps } from './ImportPanel';
import { AnalysisStateWidgetProps } from './AnalysisStateWidget';
import { HistoryPanel } from './HistoryPanel';

export type AnalysisPanelProps = {
  analysisId: AnalysisRecord['id'];
  onImportedPgn: ImportPanelProps['onImportedPgn'];
  onImportedArchivedGame: ImportPanelProps['onImportedArchivedGame'];
  onImportedRelayedGame: ImportPanelProps['onImportedRelayedGame'];
  homeColor: ChessGameColor;
  gameAndPlayers?: AnalysisStateWidgetProps['gameAndPlayers'];
  useEngine?: boolean;
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

const getHasLoadedAnalysis = (
  props: Pick<AnalysisPanelProps, 'history' | 'displayed' | 'gameAndPlayers'>
) => (!!props.history && !!props.displayed) || !!props.gameAndPlayers?.game;

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  homeColor,
  onImportedPgn,
  onImportedArchivedGame,
  onImportedRelayedGame,
  ...props
}) => {
  const cls = useStyles();
  const [hasLoadedAnalysis, setHasLoadedAnalysis] = useState(getHasLoadedAnalysis(props));
  const [showImportPanel, setShowImportPanel] = useState(!hasLoadedAnalysis);

  useEffect(() => {
    const nextHasLoadedAnalysis = getHasLoadedAnalysis(props);

    setHasLoadedAnalysis(nextHasLoadedAnalysis);
    setShowImportPanel(!nextHasLoadedAnalysis);
  }, [props.history, props.gameAndPlayers]);

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
          onImportedArchivedGame={onImportedArchivedGame}
          onImportedRelayedGame={onImportedRelayedGame}
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
        {props.history && (
          <HistoryPanel
            analysisId={props.analysisId}
            homeColor={homeColor}
            displayed={props.displayed}
            gameAndPlayers={props.gameAndPlayers}
            useEngine={props.useEngine}
            onClearButtonPress={() => {
              // Reset the Analysis
              onImportedPgn('' as SimplePGN);
              setHasLoadedAnalysis(true);
            }}
            onImportButtonPress={() => {
              setShowImportPanel(true);
            }}
          />
        )}
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
});
