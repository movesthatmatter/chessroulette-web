import { ChessGameColor, ChessMove, GameSpecsRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Game } from 'src/modules/Games';
import { useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';
import { LichessManager } from '../LichessAPI/LichessGameManager';

import { LichessChallenge, LichessChatLine, LichessGameState, LichessPlayer } from '../types';

type LichessContext = {
  initAndChallenge : (specs: GameSpecsRecord) => void;
  startStream: () => void;
  makeMove: (move: ChessMove, id: string) => void;
  onChallengeAccepted: (fn: () => void) => void;
  onChallenge: (fn: (data: { challenge: LichessChallenge }) => void) => void;
  onGameUpdate : (fn: (data : {gameState: LichessGameState}) => void) => void;
  onNewGame : (fn: (data: {game: Game, homeColor: ChessGameColor, player:LichessPlayer}) => void) => void
  onGameFinish: (fn :() => void) => void;
  onNewChatLine: (fn: (data: {chatLine: LichessChatLine}) => void) => void;
  sendChatMessage: (msg:string, gameId: string) => void;
  resignGame : (gameId:string) => void;
  acceptDraw : (gameId : string) => void;
  declineDraw : (gameId: string) => void;
  sendDrawOffer : (gameId: string) => void;
  acceptTakeback : (gameId: string) => void;
  declineTakeback: (gameId: string) => void;
  sendTakebackOffer: (gameId: string) => void;
  onRematchAccept: () => void;
  onRematchDeny: () => void;
  makeNewChallenge : (specs: GameSpecsRecord) => void;
} | undefined

export const LichessContext = React.createContext<LichessContext>(undefined);

type Props = {};

export const LichessProvider: React.FC<Props> = (props) => {
  const auth = useAuthenticatedUserWithLichessAccount();
  const [contextState, setContextState] = useState<LichessContext>(undefined);

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
        startStream: () => {
          return lichessManager.startStream();
        },
        makeMove : (move, id) => {
          return lichessManager.makeMove(move, id);
        },
        onChallengeAccepted : (fn: () => void) => {
          return lichessManager.onChallengeAccepted(fn);
        },
        onChallenge: (fn: (data: { challenge: LichessChallenge })  => void) => {
          return lichessManager.onChallenge(fn);
        },
        onGameUpdate: (fn : (data: {gameState: LichessGameState}) => void) => {
          return lichessManager.onGameUpdate(fn);
        },
        onNewGame: (fn: (data: {game: Game, homeColor: ChessGameColor, player:LichessPlayer}) => void) => {
          return lichessManager.onNewGame(fn);
        },
        onGameFinish: (fn: () => void) => { 
          return lichessManager.onGameFinished(fn);
        },
        onNewChatLine: (fn: (data: {chatLine: LichessChatLine}) => void) => {
          return lichessManager.onNewChatLine(fn);
        },
        sendChatMessage: (msg: string, gameId: string) => {
          return lichessManager.sendChatMessage(msg, gameId);
        },
        resignGame: (gameId) => {
          return lichessManager.resignGame(gameId)
        },
        acceptDraw: (gameId) => {
          return lichessManager.acceptOrOfferDraw(gameId)
        },
        declineDraw: (gameId) => {
          return lichessManager.declineDraw(gameId)
        },
        sendDrawOffer: (gameId) => {
          return lichessManager.acceptOrOfferDraw(gameId)
        },
        acceptTakeback: (gameId) => {
          return lichessManager.acceptOrOfferTakeback(gameId);
        },
        declineTakeback: (gameId) => {
          return lichessManager.declineTakeback(gameId);
        },
        sendTakebackOffer: (gameId) => {
          return lichessManager.acceptOrOfferTakeback(gameId);
        },
        onRematchAccept: () => {
          return lichessManager.acceptChallenge();
        },
        onRematchDeny: () => {
          return lichessManager.declineChallenge();
        },
        makeNewChallenge: (specs: GameSpecsRecord) => {
          return lichessManager.sendANewChallenge(specs);
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
