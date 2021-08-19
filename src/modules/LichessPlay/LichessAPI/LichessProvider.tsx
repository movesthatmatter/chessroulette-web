import useInstance from '@use-it/instance';
import { ChessMove, GameSpecsRecord, RegisteredUserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Game } from 'src/modules/Games';
import { AuthenticationProvider, useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';
import { LichessManagerType, getInstance as getLichessManager } from '../LichessGameManager';

type LichessContext = {
  initAndChallenge : (specs: GameSpecsRecord) => void;
  makeMove: (move: ChessMove) => void;
 //onGameUpdate : (game: Game) => void;
  onChallengeAccepted: (fn: () => void) => void;
} | undefined

export const LichessContext = React.createContext<LichessContext>(undefined);

type Props = {};

export const LichessProvider: React.FC<Props> = (props) => {
  const auth = useAuthenticatedUserWithLichessAccount();
  const [contextState, setContextState] = useState<LichessContext>(undefined);
  const lichessManager = useInstance<LichessManagerType>(getLichessManager);

  useEffect(() => {
    console.log('AUUTHHHH ', auth);
    setContextState(() => {
      if (!auth?.externalAccounts?.lichess){
        return undefined;
      }
     
      lichessManager.init(auth);

      return {
        initAndChallenge : (gameSpecs) => {
          // lichessManager.startStream()
          // .map(() => {
          //   lichessManager.sendChallenge(gameSpecs)
          // })
          lichessManager.startStreamAndChallenge(gameSpecs);
        },
        makeMove : (move) => {
          lichessManager.makeMove(move);
        },
        onChallengeAccepted : (fn: () => void) => {
          lichessManager.onChallengeAccepted(fn);
        }
      }
    })
  },[auth])

  return (
      <LichessContext.Provider value={contextState}>
        {props.children}
      </LichessContext.Provider>
  )
};
