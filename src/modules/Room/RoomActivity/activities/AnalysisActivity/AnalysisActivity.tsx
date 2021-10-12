import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { RoomAnalysisActivity } from './types';
import { ActivityCommonProps } from '../types';
import { ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';
import { chessHistoryToSimplePgn, otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { LayoutContainerDimensions } from 'src/modules/Room/Layouts';
import { AnalysisPanel, AnalysisPanelProps } from './components/AnalysisPanel';
import { AnalysisRecord, ChessGameColor } from 'dstnd-io';
import { toChessPlayersBySide } from 'src/modules/Games/Chess/lib';
import { setInterval, setTimeout } from 'window-or-global';
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

type Orientation = 'home' | 'away';

const getParticipantsBySide = (
  analysis: AnalysisRecord,
  participants: RoomAnalysisActivity['participants'],
  orientationInverted: boolean = false,
  defaultHomeColor: ChessGameColor = 'white'
) => {
  if (!analysis.game) {
    return undefined;
  }

  const myParticipant = Object.values(participants).find((p) => p.participant.isMe);
  const myParticipantAsPlayer = analysis.game?.players.find(
    (p) => p.user.id === myParticipant?.userId
  );

  const homeColor = myParticipantAsPlayer?.color || defaultHomeColor;

  return toChessPlayersBySide(
    analysis.game.players,
    orientationInverted ? otherChessColor(homeColor) : homeColor
  );
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

  const [participantsBySide, setParticipantsBySide] = useState(
    getParticipantsBySide(analysis, participants, roomConsumer?.boardOrientation !== 'home')
  );

  useEffect(() => {
    setParticipantsBySide(
      getParticipantsBySide(analysis, participants, roomConsumer?.boardOrientation !== 'home')
    );
  }, [analysis.game?.players, participants, roomConsumer?.boardOrientation]);

  const defaultHomeColor = roomConsumer?.boardOrientation === 'home' ? 'white' : 'black';

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
              gameAndParticipants={
                analysis.game && participantsBySide
                  ? {
                      players: participantsBySide,

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
              homeColor={participantsBySide?.home.color || defaultHomeColor}
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
    paddingTop: spacers.small,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
