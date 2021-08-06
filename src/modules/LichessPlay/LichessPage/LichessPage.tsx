import React, { useEffect, useState } from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import Chessground from 'react-chessground';
import {getInstance as getLichessGameManager, LichessManagerType} from '../LichessGameManager';
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
import { Color} from 'chessground/types';
import { toDests } from 'src/modules/Games/Chess/components/ChessBoard/util';

type Props = {};

export const LichessPage: React.FC<Props> = ({}) => {
  const cls = useStyles();
  const lichessManager = useInstance<LichessManagerType>(getLichessGameManager);
  const [chess, setChess] = useState<ChessInstance>(getNewChessGame());

  useEffect(() => {
    startSubscriptions();
  },[])
  
  function startSubscriptions() {
    lichessManager.startStream();
    lichessManager.onUpdateChess(({chess}) => setChess(chess));
    lichessManager.onGameFinished(({chess}) => {});
  }

  const onMove = (move: ChessMove) => {
    lichessManager.makeMove(move);
  }
  
  const calcMovable =() => {
    return {
      free: false,
      // This is what determines wether a someone can move a piece!
      dests: toDests(chess),
      color: 'black',
      // Don't show the dests
      showDests: false,
    } as const;
  }

  return (
    <Page name='lichess'>
          {/* <Chessground
            fen={fen}
            turnColor={lichessManager.game ? getTurn(chess.turn()) : 'white'}
            movable={calcMovable()}
            check={chess.in_check()}
            orientation={"white" as ChessGameColor}
          /> */}
        {/* <Chessground
          //id={lichessManager.game?.id || new Date().getTime().toString()}
          fen={chess.fen()}
          movable={calcMovable()}
          onMove={(orig, dest) => onMove({from: orig as Square, to: dest as Square})}
          //onMove={({move}) => onMove(move)}
          //size={512}
          viewOnly={false}
          turnColor={chess.turn() === 'b' ? 'black' : 'white'}
         // homeColor={lichessManager.homeColor || 'black'}      
        />
          <Button label='Challenge' onClick={() => {
            lichessManager.sendChallenge();
          }}
          />  */}
        <ChessBoard
          id={lichessManager.game?.id || new Date().getTime().toString()}
          pgn={chess.pgn()}
          movable={calcMovable()}
          onMove={({move}) => onMove(move)}
          size={512}
          draggable={{ enabled: true}}
          playable
          turnColor={chess.turn() === 'b' ? 'black' : 'white'}
          homeColor={lichessManager.homeColor || 'black'}      
        />
          <Button label='Challenge' onClick={() => {
            lichessManager.sendChallenge();
          }}
          /> 
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});