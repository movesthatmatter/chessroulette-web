import useInstance from '@use-it/instance';
import { ChessGameColor, ChessMove, GameSpecsRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Game } from 'src/modules/Games';
import { useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';
import { LichessManagerType, getInstance as getLichessManager } from '../LichessGameManager';
import { LichessGameState } from '../types';

type LichessContext = {
  initAndChallenge : (specs: GameSpecsRecord) => void;
  makeMove: (move: ChessMove, id: string) => void;
  onChallengeAccepted: (fn: () => void) => void;
  onGameUpdate : (fn: (data : {gameState: LichessGameState}) => void) => void;
  onNewGame : (fn: (data: {game: Game, homeColor: ChessGameColor}) => void) => void
} | undefined

export const LichessContext = React.createContext<LichessContext>(undefined);

type Props = {};

export const LichessProvider: React.FC<Props> = (props) => {
  const auth = useAuthenticatedUserWithLichessAccount();
  const [contextState, setContextState] = useState<LichessContext>(undefined);
  const lichessManager = useInstance<LichessManagerType>(getLichessManager);

  useEffect(() => {
    setContextState(() => {
      if (!auth?.externalAccounts?.lichess){
        return undefined;
      }
     
      lichessManager.init(auth);

      return {
        initAndChallenge : (gameSpecs) => {
          lichessManager.startStreamAndChallenge(gameSpecs);
        },
        makeMove : (move, id) => {
          lichessManager.makeMove(move, id);
        },
        onChallengeAccepted : (fn: () => void) => {
          lichessManager.onChallengeAccepted(fn);
        },
        onGameUpdate: (fn : (data: {gameState: LichessGameState}) => void) => {
          lichessManager.onGameUpdate(fn);
        },
        onNewGame: (fn: (data: {game: Game, homeColor: ChessGameColor}) => void) => {
          lichessManager.onNewGame(fn);
        }
      }
    })
  },[auth])

  useEffect(() => {
    
  },[lichessManager])  

  return (
      <LichessContext.Provider value={contextState}>
        {props.children}
      </LichessContext.Provider>
  )
};
