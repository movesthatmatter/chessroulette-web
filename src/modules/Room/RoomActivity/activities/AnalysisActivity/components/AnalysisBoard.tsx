import { AnalysisRecord, ChessHistoryIndex } from 'dstnd-io';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import React, { useCallback, useMemo } from 'react';
import { ChessBoard, ChessBoardProps } from 'src/modules/Games/Chess/components/ChessBoard';
import { ChessGameHistoryContextProps } from 'src/modules/Games/Chess/components/GameHistory';

type Props = Omit<ChessBoardProps, 'onMove' | 'type' | 'pgn'> & {
  history: AnalysisRecord['history'];
  displayedIndex: ChessHistoryIndex;
  onAddMove: ChessGameHistoryContextProps['onAddMove'];
};

export const AnalysisBoard: React.FC<Props> = ({
  history,
  displayedIndex,
  onAddMove,
  ...boardProps
}) => {
  const pgn = useMemo(() => chessHistoryToSimplePgn(history), [history]);

  const onMove = useCallback<ChessBoardProps['onMove']>(
    ({ move }) => {
      onAddMove({
        move: {
          ...move,
          clock: 0, // the clock doesn't matter on the analysis
        },
        atIndex: displayedIndex,
        withRefocus: true,
      });
    },
    [displayedIndex]
  );

  return <ChessBoard type="analysis" pgn={pgn} onMove={onMove} {...boardProps} />;
};
