import { useContext } from 'react';
import { ChessGameHistoryContext } from './ChessGameHistoryContext';

export const useChessGameHistory = () => useContext(ChessGameHistoryContext);
