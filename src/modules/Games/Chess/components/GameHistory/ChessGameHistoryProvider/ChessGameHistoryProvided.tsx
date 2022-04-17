import { AnalysisRecord } from 'chessroulette-io';
import React from 'react';
import { GameHistory, GameHistoryProps } from '../GameHistory';
import { ChessGameHistoryConsumer } from './ChessGameHistoryConsumer';

type Props = Omit<GameHistoryProps, 'history' | 'focusedIndex' | 'onRefocus'>;

export const ChessGameHistoryProvided: React.FC<Props> = (props) => {
  return (
    <ChessGameHistoryConsumer
      render={(c) => (
        <GameHistory
          history={c.history}
          focusedIndex={c.displayed.index}
          onRefocus={c.onRefocus}
          {...props}
        />
      )}
    />
  );
};
