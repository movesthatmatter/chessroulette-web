import useInstance from '@use-it/instance';
import { ChessGameColor, ChessMove, GameSpecsRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Game } from 'src/modules/Games';
import { useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';
import { LichessManager } from '../LichessGameManager';

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
  // const lichessManager = useInstance<LichessManagerType>(getLichessManager);

  useEffect(() => {
    setContextState(() => {
      if (!auth?.externalAccounts?.lichess){
        return undefined;
      }
     
      const lichessManager = new LichessManager(auth);

      return {
        initAndChallenge : (gameSpecs) => {
          return lichessManager.startStreamAndChallenge(gameSpecs);
        },
        makeMove : (move, id) => {
          return lichessManager.makeMove(move, id);
        },
        onChallengeAccepted : (fn: () => void) => {
          return lichessManager.onChallengeAccepted(fn);
        },
        onGameUpdate: (fn : (data: {gameState: LichessGameState}) => void) => {
          return lichessManager.onGameUpdate(fn);
        },
        onNewGame: (fn: (data: {game: Game, homeColor: ChessGameColor}) => void) => {
          return lichessManager.onNewGame(fn);
        }
      }
    })
  },[auth?.externalAccounts?.lichess.userId])

  return (
      <LichessContext.Provider value={contextState}>
        {props.children}
      </LichessContext.Provider>
  )
};
