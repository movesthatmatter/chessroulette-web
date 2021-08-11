import React from 'react';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';

type Props = {
  render: (c: ChessGameHistoryContextProps) => React.ReactNode;
};

export const ChessGameHistoryConsumer: React.FC<Props> = ({ render }) => {
  return <ChessGameHistoryContext.Consumer children={(c) => render(c)} />;
};
