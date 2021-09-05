import React, { useEffect, useState } from 'react';
import { ChatMessageRecord, ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove, GuestUserRecord } from 'dstnd-io';
import { LichessChatLine, LichessGameState } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import { convertLichessChatLineToChatMessageRecord, filterChatLineMessage, updateGameWithNewStateFromLichess } from '../utils';
import { console } from 'window-or-global';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { useLichessGameActions } from '../useLichessGameActions/useLichessGameActions';
import { useSelector } from 'react-redux';
import { selectGame } from 'src/modules/Room/RoomActivity/redux/selectors';
import { useLichessChatProvider } from './useLichessChatProvider/useLichessChatProvider';
import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';
import { getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';

type Props = {
  boardSize: number;
  onSendNewChatMessage: (payload: ChatMessageRecord) => void;
}

export const LichessGameContainer: React.FC<Props> = ({boardSize, onSendNewChatMessage}) => {
  const game = useSelector(selectGame)
  const [newGameState, setNewGameState] = useState<LichessGameState | undefined>(undefined);
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const lichess = useLichessProvider();
  const gameActions = useLichessGameActions();
  const auth = useAuthenticatedUserWithLichessAccount();

  useLichessChatProvider();

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor, player }) => {
        setHomeColor(homeColor);
        gameActions.onJoinedGame(game, player);
        const awayPlayer = getPlayerByColor(homeColor === 'black' ? 'white' : 'black', game.players)
        authenticateAsExistentGuest({guestUser: awayPlayer.user as GuestUserRecord})
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
      gameActions.onUpdateGame(updateGameWithNewStateFromLichess(game, newGameState));
    }
  }, [newGameState]);

  const onMove = (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => {
    if (game && lichess) {
      lichess.makeMove(p.move, game.vendorData?.gameId as string);
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
      if (filterChatLineMessage(chatLine, auth?.externalAccounts.lichess.userId as string)){
        onSendNewChatMessage(convertLichessChatLineToChatMessageRecord(chatLine));
      }
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
