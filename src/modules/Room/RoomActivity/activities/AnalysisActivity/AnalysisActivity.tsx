import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { RoomAnalysisActivity } from './types';
import { ActivityCommonProps } from '../types';
import { ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';
import { chessHistoryToSimplePgn, otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { LayoutContainerDimensions } from 'src/modules/Room/Layouts';
import { AnalysisPanel, AnalysisPanelProps } from './components/AnalysisPanel';
import { AnalysisRecord } from 'dstnd-io';
import { toChessPlayersByColor } from 'src/modules/Games/Chess/lib';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { spacers } from 'src/theme/spacers';

export type AnalysisActivityProps = ActivityCommonProps & {
  participants: RoomAnalysisActivity['participants'];
  analysis: NonNullable<RoomAnalysisActivity['analysis']>;
  boardSize: number;
  leftSide: LayoutContainerDimensions;
  onImportedPgn: AnalysisPanelProps['onImportedPgn'];
  onImportedGame: AnalysisPanelProps['onImportedGame'];
};

const getParticipantsByColor = (analysis: AnalysisRecord) => {
  if (!analysis.game) {
    return undefined;
  }

  return toChessPlayersByColor(analysis.game.players);
};

// This always defaults to White
const getHomeColor = (
  analysis: AnalysisRecord,
  participants: RoomAnalysisActivity['participants'],
  orientationInverted: boolean = false
) => {
  const defaultHomeColor = 'white';

  if (!analysis.game) {
    return orientationInverted ? otherChessColor(defaultHomeColor) : defaultHomeColor;
  }

  const myParticipant = Object.values(participants).find((p) => p.participant.isMe);
  const myParticipantAsPlayer = analysis.game?.players.find(
    (p) => p.user.id === myParticipant?.userId
  );

  const homeColor = myParticipantAsPlayer?.color || defaultHomeColor;

  return orientationInverted ? otherChessColor(homeColor) : homeColor;
};

export const AnalysisActivity: React.FC<AnalysisActivityProps> = ({
  participants,
  analysis,
  boardSize,
  leftSide,
  onImportedPgn,
  onImportedGame,
}) => {
  const cls = useStyles();
  const pgnFromHistory = analysis.history ? chessHistoryToSimplePgn(analysis.history) : '';
  const roomConsumer = useRoomConsumer();
  const participantsByColor = getParticipantsByColor(analysis);
  const homeColor = getHomeColor(analysis, participants, roomConsumer?.boardOrientation === 'away');

  return (
    <ChessGameHistoryConsumer
      render={({ history, displayedHistory, onAddMove, displayedIndex }) => (
        <div className={cls.container}>
          <aside className={cls.side} style={{ height: boardSize, width: leftSide.width }}>
            <AnalysisPanel
              analysisRecord={
                history.length > 0
                  ? {
                      history,
                      displayedHistory,
                      displayedIndex,
                    }
                  : undefined
              }
              onImportedPgn={onImportedPgn}
              onImportedGame={onImportedGame}
              homeColor={homeColor}
              gameAndPlayers={
                analysis.game && participantsByColor
                  ? {
                      players: participantsByColor,

                      // TODO: This should be memoized or somewhere up the chain so it doesn't change too often
                      game: analysis.game,
                    }
                  : undefined
              }
            />
          </aside>
          <div className={cls.boardContainer} style={{ height: boardSize }}>
            <ChessBoard
              size={boardSize}
              type="analysis"
              id={analysis.id}
              playable
              canInteract
              pgn={displayedHistory ? chessHistoryToSimplePgn(displayedHistory) : pgnFromHistory}
              homeColor={homeColor}
              onMove={(m) => {
                onAddMove(
                  {
                    ...m.move,
                    clock: 0, // the clock doesn't matter on analysis
                  },
                  displayedIndex
                );
              }}
              className={cls.board}
            />
            <BoardSettingsWidgetRoomConsumer containerClassName={cls.settingsBar} />
          </div>
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  boardContainer: {
    ...floatingShadow,
  },
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  sideTop: {
    height: '30%',
  },
  sideMiddle: {
    height: '40%',
  },
  sideBottom: {
    height: '30%',
  },
  settingsBar: {
    paddingTop: spacers.default,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
