import React, { useEffect } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { RoomAnalysisActivity } from './types';
import { ActivityCommonProps } from '../types';
import { ChessGameHistoryConsumer } from 'src/modules/Games/Chess/components/GameHistory';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { LayoutContainerDimensions } from 'src/modules/Room/Layouts';
import { RoomRecord, SimplePGN } from 'dstnd-io';
import { AnalysisPanel } from './components/AnalysisPanel';
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationAction } from 'src/modules/Room/RoomActivityLog/redux/actions';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { Date, Object } from 'window-or-global';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/RoomActivityLog/redux/selectors';
import { toRoomUrlPath } from 'src/lib/util';
import { ClipboardCopyWidget } from 'src/components/ClipboardCopy';
import { Button, IconButton } from 'src/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { spacers } from 'src/theme/spacers';
import { selectRoom } from 'src/providers/PeerProvider';

export type AnalysisActivityProps = ActivityCommonProps & {
  boardSize: number;
  leftSide: LayoutContainerDimensions;
  analysis: NonNullable<RoomAnalysisActivity['analysis']>;

  onPgnImported: (pgn: SimplePGN) => void;
};

export const AnalysisActivity: React.FC<AnalysisActivityProps> = ({
  analysis,
  boardSize,
  leftSide,
  onPgnImported,
}) => {
  const cls = useStyles();
  const pgnFromHistory = analysis.history ? chessHistoryToSimplePgn(analysis.history) : '';
  const dispatch = useDispatch();
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const room = useSelector(selectRoom);

  useEffect(() => {
    if (
      Object.values(activityLog.history).filter(
        (log) => log.type === 'roomSpecific' && log.activity === 'analysis' && log.activityId === analysis.id
      ).length === 0
    ) {
      dispatch(
        addNotificationAction({
          notification: {
            type: 'roomSpecific',
            activity: 'analysis',
            activityId: analysis.id,
            timestamp: toISODateTime(new Date()),
            id: new Date().getTime().toString(),
            content: {
              __html: `Welcome to the <strong>Analysis</strong> room.`,
            },
            actionContent: (
              <ClipboardCopyWidget
                value={`${window.location.origin}/${toRoomUrlPath(room as RoomRecord)}`}
                render={({ copied, copy }) => (
                  <Button
                    type="primary"
                    clear
                    icon={() => (
                      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={cls.icon} />
                    )}
                    onClick={copy}
                    label={copied ? 'Link Copied!' : 'Invite Friend'}
                  />
                )}
              />
            ),
          },
        })
      );
    }
  }, []);

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
                    }
                  : undefined
              }
              onPgnImported={onPgnImported}
            />
          </aside>
          <div
            className={cls.boardContainer}
            style={{
              height: boardSize,
            }}
          >
            <ChessBoard
              size={boardSize}
              type="analysis"
              id={analysis.id}
              playable
              canInteract
              pgn={displayedHistory ? chessHistoryToSimplePgn(displayedHistory) : pgnFromHistory}
              homeColor="white"
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
  subtleButton: {
    marginRight: spacers.small,
    height: '30px',
    width: '30px',
    ...makeImportant({
      marginBottom: 0,
    }),
  },
  icon: {
    color: colors.primary,
  }
});
