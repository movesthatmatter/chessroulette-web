import React, { useEffect, useState } from 'react';
import { AuthenticatedPage, LichessAuthenticatedPage, Page } from 'src/components/Page';
import { Button } from 'src/components/Button';
import useInstance from '@use-it/instance';
import { ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { LichessChallenge } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { Game } from 'src/modules/Games';
import { ChessGame } from 'src/modules/Games/Chess';
import { GameMocker } from 'src/mocks/records';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { PlayProps } from 'src/modules/Rooms/PlayRoom/Layouts';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import { updateGameWithNewStateFromLichess } from '../utils';

type Props = Pick<PlayProps, 'displayedPgn' | 'game' | 'meAsPlayer' | 'playable'>

export const PlayLichess: React.FC<Props> = (props) => {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [challenge, setChallenge] = useState<LichessChallenge | undefined>(undefined);
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const lichess = useLichessProvider();

  useEffect(() => {
      lichess?.onNewGame(({game, homeColor}) => {
        setGame(game);
        setHomeColor(homeColor);
      })
      lichess?.onGameUpdate(({gameState}) => setGame(updateGameWithNewStateFromLichess(game as Game, gameState)));
  }, []);

  if (!lichess) {
    return null;
  }
  // function startSubscriptions() {
  //  // lichessManager.startStream();
  //   // lichessManager.onUpdateChess(({ chess }) => setChess(chess));
  //   lichessManager.onGameFinished(({ game }) => setGame(game));
  //   lichessManager.onChallenge(({ challenge }) => setChallenge(challenge));
  // }

  const onMove = (p : { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => {
    if (game){
      lichess.makeMove(p.move, game.id);
    }
  };



  return (
    <LichessAuthenticatedPage name="lichess">
      {/* <LichessGameStateDialogProvider
        game={game}
        challenge={challenge}
        state={game.state}
      > */}
        {game && <LichessGame
              // Reset the State each time the game id changes
              key={game.id}
              game={game}
              //displayedPgn={props.displayedPgn}
              homeColor={homeColor}
              size={512}
              playable
              onMove={onMove}
              //className={cls.board}
            />}
        {/* <ChessBoard
          id={lichessManager.lichessGame?.id || new Date().getTime().toString()}
          onMove={({ move }) => onMove(move)}
          play          turnColor={chess.turn() === 'b' ? 'black' : 'white'}
          homeColor={lichessManage || 'black'}
        /> */}
      {/* </LichessGameStateDialogProvider> */}
    </LichessAuthenticatedPage>
  );
};
