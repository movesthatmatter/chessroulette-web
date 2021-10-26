import React, { useCallback, useEffect, useMemo } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { RoomAnalysisActivity } from './types';
import { ActivityCommonProps } from '../types';
import {
  ChessGameHistoryConsumer,
  ChessGameHistoryContextProps,
  useChessGameHistory,
} from 'src/modules/Games/Chess/components/GameHistory';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { LayoutContainerDimensions } from 'src/modules/Room/Layouts';
import { AnalysisPanel, AnalysisPanelProps } from './components/AnalysisPanel';
import { AnalysisRecord } from 'dstnd-io';
import { toChessPlayersByColor } from 'src/modules/Games/Chess/lib';
import { BoardSettingsWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/BoardSettingsWidgetRoomConsumer';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { spacers } from 'src/theme/spacers';
import { AnalysisBoard } from './components/AnalysisBoard';

export type AnalysisActivityProps = ActivityCommonProps & {
  participants: RoomAnalysisActivity['participants'];
  analysis: NonNullable<RoomAnalysisActivity['analysis']>;
  boardSize: number;
  leftSide: LayoutContainerDimensions;
  onImportedPgn: AnalysisPanelProps['onImportedPgn'];
  onImportedGame: AnalysisPanelProps['onImportedGame'];
};

const getParticipantsByColor = (game: NonNullable<AnalysisRecord['game']>) =>
  toChessPlayersByColor(game.players);

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

export const AnalysisActivity: React.FC<AnalysisActivityProps> = React.memo(({
  participants,
  analysis,
  boardSize,
  leftSide,
  onImportedPgn,
  onImportedGame,
}) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const homeColor = useMemo(
    () => getHomeColor(analysis, participants, roomConsumer?.boardOrientation === 'away'),
    [roomConsumer?.boardOrientation, analysis, participants]
  );
  const { history, displayed, onAddMove } = useChessGameHistory();

  const gameAndPlayers = useMemo(() => {
    if (!analysis.game) {
      return undefined;
    }

    return {
      players: getParticipantsByColor(analysis.game),
      game: analysis.game,
    };
  }, [analysis.game]);

  return (
    <div className={cls.container}>
      <aside className={cls.side} style={{ height: boardSize, width: leftSide.width }}>
        <AnalysisPanel
          history={history}
          displayed={displayed}
          onImportedPgn={onImportedPgn}
          onImportedGame={onImportedGame}
          homeColor={homeColor}
          gameAndPlayers={gameAndPlayers}
        />
      </aside>
      <div className={cls.boardContainer} style={{ height: boardSize }}>
        <AnalysisBoard
          size={boardSize}
          id={analysis.id}
          playable
          canInteract
          pgn={displayed.pgn}
          displayedIndex={displayed.index}
          playableColor={homeColor}
          onAddMove={onAddMove}
          className={cls.board}
        />
        <BoardSettingsWidgetRoomConsumer containerClassName={cls.settingsBar} />
      </div>
    </div>
  );
});

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
