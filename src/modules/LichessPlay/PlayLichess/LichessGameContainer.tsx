import React, { useEffect, useState } from 'react';
import { ChatMessageRecord, ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { LichessChatLine, LichessGameState } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { Game } from 'src/modules/Games';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import { convertLichessChatLineToChatMessageRecord, updateGameWithNewStateFromLichess } from '../utils';
import { console } from 'window-or-global';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { useLichessGameActions } from '../useLichessGameActions/useLichessGameActions';

type Props = {
  boardSize: number;
  onSendNewChatMessage: (payload: ChatMessageRecord) => void;
}

export const LichessGameContainer: React.FC<Props> = ({boardSize, onSendNewChatMessage}) => {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [newGameState, setNewGameState] = useState<LichessGameState | undefined>(undefined);
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const lichess = useLichessProvider();
  const gameActions = useLichessGameActions();

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor, player }) => {
        setGame(game);
        setHomeColor(homeColor);
        gameActions.onJoinedGame(game, player);
      });
      lichess.onGameUpdate(({ gameState }) => {
        setNewGameState(gameState);
      });
      lichess.onGameFinish(() => {
        console.log('Game Finished');
      });
      lichess.onNewChatLine(({chatLine}) => {
        processChatLine(chatLine);
      })
    }
  }, []);

  useEffect(() => {
    if (newGameState && game) {
      setGame((prev) => {
        return updateGameWithNewStateFromLichess(prev as Game, newGameState);
      });
      gameActions.onUpdateGame(game);
    }
  }, [newGameState]);

  const onMove = (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => {
    if (game && lichess) {
      lichess.makeMove(p.move, game.id);
    }
  };

  const processChatLine = (chatLine : LichessChatLine) => {
    if (chatLine.username === 'lichess'){
      if (chatLine.text.includes('offers draw') && chatLine.room === 'player'){
        //TODO dispatch notification
      }
      if (chatLine.text.includes('Takeback') && chatLine.room === 'player'){
        if (chatLine.text.includes('sent')){
        //TODO dispatch notification
        }
        if (chatLine.text.includes('cancelled')){
        //TODO dispatch notification
        }
      }
    } else {
      onSendNewChatMessage(convertLichessChatLineToChatMessageRecord(chatLine));
    }
  }

  return (
    <>
      {game ? (
      <LichessGameStateDialogProvider
        game={game}
        status={newGameState?.status}
      > 
      <ChessGameHistoryProvider history={game?.history || []}>
            <LichessGame
              type="play"
              // Reset the State each time the game id changes
              key={game.id}
              game={game}
              homeColor={homeColor}
              size={boardSize}
              playable
              onMove={onMove}
            />
      </ChessGameHistoryProvider>
      </LichessGameStateDialogProvider>
      ): (
        <ChessBoard
          type="free"
          size={boardSize}
          id="empty-frozen-board"
          pgn=""
          homeColor="white"
          onMove={() => {}}
          style={{
            ...floatingShadow,
            ...softBorderRadius,
            overflow: 'hidden',
          }}
        />
      )}
    </>
  );
};
