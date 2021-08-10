import React, { useEffect, useState } from 'react';
import { AuthenticatedPage, LichessAuthenticatedPage, Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { getInstance as getLichessGameManager, LichessManagerType } from '../LichessGameManager';
import { Button } from 'src/components/Button';
import useInstance from '@use-it/instance';
import { getNewChessGame} from 'src/modules/Games/Chess/lib';
import { ChessInstance } from 'chess.js';
import { ChessMove } from 'dstnd-io';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { toDests } from 'src/modules/Games/Chess/components/ChessBoard/util';
import { LichessChallenge, LichessGameFull } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { LichessGameStateDialogConsumer } from './components/LichessGameStateDialogConsumer';
import { useAuthentication } from 'src/services/Authentication';
import { console } from 'window-or-global';

type Props = {};

export const LichessPage: React.FC<Props> = ({}) => {
  const lichessManager = useInstance<LichessManagerType>(getLichessGameManager);
  const [chess, setChess] = useState<ChessInstance>(getNewChessGame());
  const [game, setGame] = useState<LichessGameFull | undefined>(undefined);
  const [challenge, setChallenge] = useState<LichessChallenge | undefined>(undefined);
  const authentication = useAuthentication();

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
    <LichessAuthenticatedPage name="lichess">
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
            console.log('authenticated user ', authentication);
            //lichessManager.sendChallenge();
          }}
        />
      </LichessGameStateDialogProvider>
    </LichessAuthenticatedPage>
  );
};
