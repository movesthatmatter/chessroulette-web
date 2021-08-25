import React, { useEffect, useState } from 'react';
import { LichessAuthenticatedPage } from 'src/components/Page';
import { ChatHistoryRecord, ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { LichessChatLine, LichessGameState } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { Game } from 'src/modules/Games';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import { convertLichessChatLineToChatMessageRecord, updateGameWithNewStateFromLichess } from '../utils';
import { console } from 'window-or-global';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { Chat } from 'src/modules/Chat/Chat';

export const PlayLichess: React.FC = ({}) => {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [newGameState, setNewGameState] = useState<LichessGameState | undefined>(undefined);
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const lichess = useLichessProvider();
  const auth = useAuthenticatedUser();
  //TODO this should be in the room! 
  const [chatHistory, setChatHistory] = useState<ChatHistoryRecord>({
    id: game?.id || new Date().getTime().toString(),
    messages: [],
    usersInfo: {}
  });

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor }) => {
        setGame(game);
        setHomeColor(homeColor);
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
      chatHistory.messages.push(convertLichessChatLineToChatMessageRecord(chatLine))
    }
  }

  return (
    <LichessAuthenticatedPage name="lichess" doNotTrack>
      <LichessGameStateDialogProvider
        game={game}
        status={newGameState?.status}
      > 
      {game && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <LichessGame
              // Reset the State each time the game id changes
              key={game.id}
              game={game}
              homeColor={homeColor}
              size={512}
              playable
              onMove={onMove}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <GameStateWidget
                key={game.id}
                game={game}
                homeColor={homeColor}
                // historyFocusedIndex={props.historyIndex}
                // onHistoryFocusedIndexChanged={props.onHistoryIndexUpdated}
                // TODO: This should probably be seperate from the GameStateWidget
                //  something like a hook so it can be used without a view component
                //onTimerFinished={gameActions.onTimerFinished}
              />
            </div>
            {auth && <div>
             <Chat
              myId={auth.id}
              history={chatHistory}
              onSend={(msg) => {
                if (lichess){
                  lichess.sendChatMessage(msg, game.id);
                }
              }}
             />
            </div>}
          </div>
      )}
      </LichessGameStateDialogProvider>
    </LichessAuthenticatedPage>
  );
};
