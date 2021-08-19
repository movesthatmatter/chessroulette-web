import React, { useEffect, useState } from 'react';
import { AuthenticatedPage, LichessAuthenticatedPage, Page } from 'src/components/Page';
import { getInstance as getLichessGameManager, LichessManagerType } from '../LichessGameManager';
import { Button } from 'src/components/Button';
import useInstance from '@use-it/instance';
import { ChessMove } from 'dstnd-io';
import { LichessChallenge } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { Game } from 'src/modules/Games';
import { ChessGame } from 'src/modules/Games/Chess';
import { GameMocker } from 'src/mocks/records';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { PlayProps } from 'src/modules/Rooms/PlayRoom/Layouts';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';

type Props = Pick<PlayProps, 'displayedPgn' | 'game' | 'meAsPlayer' | 'playable'>

export const PlayLichess: React.FC<Props> = (props) => {
  const lichess = useLichessProvider();
  // const [chess, setChess] = useState<ChessInstance>(getNewChessGame());
  // const [game, setGame] = useState<LichessGameFull | undefined>(undefined);
  const [game, setGame] = useState<Game>(new GameMocker().record());
  const [challenge, setChallenge] = useState<LichessChallenge | undefined>(undefined);
  
  useEffect(() => {
   // startSubscriptions();
  }, []);

  // function startSubscriptions() {
  //  // lichessManager.startStream();
  //   // lichessManager.onUpdateChess(({ chess }) => setChess(chess));
  //   lichessManager.onGameFinished(({ game }) => setGame(game));
  //   lichessManager.onChallenge(({ challenge }) => setChallenge(challenge));
  // }

  const onMove = (move: ChessMove) => {
    lichess!.makeMove(move);
  };


  return (
    <LichessAuthenticatedPage name="lichess">
      {/* <LichessGameStateDialogProvider
        game={game}
        challenge={challenge}
        state={game.state}
      > */}
        <LichessGame
              // Reset the State each time the game id changes
              key={game.id}
              game={game}
              //displayedPgn={props.displayedPgn}
              homeColor={'white'}
              size={512}
              playable
              //className={cls.board}
            />
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
