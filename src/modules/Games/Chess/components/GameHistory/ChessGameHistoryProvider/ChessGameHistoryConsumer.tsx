import React, { useEffect } from 'react';
import { noop } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';
import { useChessGameHistory } from './useChessGameHistory';

type Props = {
  render: (c: ChessGameHistoryContextProps) => React.ReactNode;
  onUpdated?: (c: ChessGameHistoryContextProps) => void;
};

export const ChessGameHistoryConsumer: React.FC<Props> = ({ render, onUpdated = noop }) => {
  const context = useChessGameHistory();

  useEffect(() => {
    onUpdated(context);
  }, [context.displayed.fen, context.cachedHistoryFen]); // Optimized around the fen only not whole history object!

  return <ChessGameHistoryContext.Consumer children={render} />;
};
