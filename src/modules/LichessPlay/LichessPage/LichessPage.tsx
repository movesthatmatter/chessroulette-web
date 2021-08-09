import React, { useEffect, useState } from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import Chessground from 'react-chessground';
import { getInstance as getLichessGameManager, LichessManagerType } from '../LichessGameManager';
import { Button } from 'src/components/Button';
import useInstance from '@use-it/instance';
import { getNewChessGame, getStartingFen, getStartingPgn } from 'src/modules/Games/Chess/lib';
import { console, Date } from 'window-or-global';
import { ChessInstance, Square } from 'chess.js';
import { ChessGameColor, ChessMove } from 'dstnd-io';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { Chess } from 'chessops/chess';
import { chessgroundDests } from 'chessops/compat';
import { StyledChessBoard } from 'src/modules/Games/Chess/components/ChessBoard/StyledChessBoard';
import { Color } from 'chessground/types';
import { toDests } from 'src/modules/Games/Chess/components/ChessBoard/util';
import { LichessChallenge, LichessGameFull } from '../types';
import { LichessGameStateDialog } from './components/LichessGameStateDialog';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { LichessGameStateDialogConsumer } from './components/LichessGameStateDialogConsumer';

type Props = {};

export const LichessPage: React.FC<Props> = ({}) => {
  const cls = useStyles();
  const lichessManager = useInstance<LichessManagerType>(getLichessGameManager);
  const [chess, setChess] = useState<ChessInstance>(getNewChessGame());
  const [game, setGame] = useState<LichessGameFull | undefined>(undefined);
  const [challenge, setChallenge] = useState<LichessChallenge | undefined>(undefined);

  useEffect(() => {
    startSubscriptions();
  }, []);

  function startSubscriptions() {
    lichessManager.startStream();
    lichessManager.onUpdateChess(({ chess }) => setChess(chess));
    lichessManager.onGameFinished(({ game }) => setGame(game));
    lichessManager.onChallenge(({ challenge }) => setChallenge(challenge));
  }

  const onMove = (move: ChessMove) => {
    lichessManager.makeMove(move);
  };

  const calcMovable = () => {
    return {
      free: false,
      // This is what determines wether a someone can move a piece!
      dests: toDests(chess),
      color: 'black',
      // Don't show the dests
      showDests: false,
    } as const;
  };

  return (
    <Page name="lichess">
      <LichessGameStateDialogProvider
        game={game}
        challenge={challenge}
        state={game?.state.status || 'pending'}
      >
        <ChessBoard
          id={lichessManager.game?.id || new Date().getTime().toString()}
          pgn={chess.pgn()}
          movable={calcMovable()}
          onMove={({ move }) => onMove(move)}
          size={512}
          draggable={{ enabled: true }}
          playable
          turnColor={chess.turn() === 'b' ? 'black' : 'white'}
          homeColor={lichessManager.homeColor || 'black'}
          overlayComponent={<LichessGameStateDialogConsumer />}
        />
        <Button
          label="Challenge"
          onClick={() => {
            lichessManager.sendChallenge();
          }}
        />
      </LichessGameStateDialogProvider>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});
