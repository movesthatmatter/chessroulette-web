import { ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import React from 'react';
import { Game } from 'src/modules/Games/types';
import { LichessGameStateDialogConsumer } from 'src/modules/LichessPlay/LichessGameContainer/LichessGameStateDialog/LichessGameStateDialogConsumer';
import { useSoundEffects } from '../../Games/Chess/hooks';
import { ChessBoard, ChessBoardProps } from '../../Games/Chess/components/ChessBoard';

type LichessGameProps = Omit<ChessBoardProps, 'onMove' | 'id' | 'pgn' | 'overlayComponent'> & {
  game: Game;
  displayedPgn?: string;
  onMove: (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => void;
};

export const LichessGame: React.FC<LichessGameProps> = (props) => {
  const {game, displayedPgn, onMove, ...chessGameProps} = props;

  useSoundEffects(game);

  return (
    <ChessBoard
      id={game.id}
      pgn={displayedPgn === undefined ? game.pgn : displayedPgn}
      onMove={onMove}
      overlayComponent={<LichessGameStateDialogConsumer />}
      {...chessGameProps}
    />
  );
};
