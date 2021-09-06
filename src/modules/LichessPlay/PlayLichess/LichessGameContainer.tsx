import React, { useEffect, useState } from 'react';
import { ChatMessageRecord, ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove, ChessPlayer, GuestUserRecord, RoomRecord } from 'dstnd-io';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectGame } from 'src/modules/Room/RoomActivity/redux/selectors';
import { useLichessChatProvider } from './useLichessChatProvider/useLichessChatProvider';
import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';
import { getOppositePlayer, getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';
import { addNotificationAction, resolveOfferNotificationAction } from 'src/modules/Room/RoomActivityLog/redux/actions';
import { Game } from 'src/modules/Games';
import { Notification, OfferNotification } from 'src/modules/Room/RoomActivityLog/types';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/RoomActivityLog/redux/selectors';

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
  const [lichessChatLinesLog, setLichessChatLinesLog] = useState<LichessChatLine[]>([]);
  const dispatch = useDispatch();
  const activitLog = useSelector(selectCurrentRoomActivityLog);

  useLichessChatProvider();

  const getAwayPlayer = (color: ChessGameColor, game: Game) => 
  getPlayerByColor(color === 'black' ? 'white' : 'black', game.players)

  const getHomePlayer = (color: ChessGameColor, game:Game) =>
  getPlayerByColor(color, game.players)

  const getMessageCorrespondence = (chatLine: LichessChatLine, color: ChessGameColor, game: Game) : Pick<OfferNotification, 'byUser' | 'toUser'> => {
    const awayPlayer = getAwayPlayer(color, game).user;
    const homePlayer = getHomePlayer(color, game).user;
    return {
      ...(awayPlayer.name !== chatLine.username) ? {
        byUser: awayPlayer,
        toUser: homePlayer
      } : {
        byUser: homePlayer,
        toUser: awayPlayer
      }
    }
  }

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor, player }) => {
        setHomeColor(homeColor);
        gameActions.onJoinedGame(game, player);
        authenticateAsExistentGuest({guestUser: getAwayPlayer(homeColor, game).user as GuestUserRecord})
      });
      lichess.onGameUpdate(({ gameState }) => {
        setNewGameState(gameState);
      });
      lichess.onGameFinish(() => {
        console.log('Game Finished');
      });
      lichess.onNewChatLine(({chatLine}) => {
        setLichessChatLinesLog(prev => [...prev, chatLine])
      })
    }
  }, []);

  useEffect(() => {
    if (lichessChatLinesLog.length > 0 && game){
      processChatLine(lichessChatLinesLog[lichessChatLinesLog.length - 1]);
    }
  },[lichessChatLinesLog])

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

  const getTakebackNotificationId = (log: {
    history: Record<Notification['id'], Notification>;
    pending?: OfferNotification;
  }) => {
    if (log.pending?.offerType === 'takeback'){
      return log.pending.id
    }
    return Object.values(log.history).find(s => s.type === 'offer' && s.offerType === 'takeback' && s.status === 'pending')?.id
  }

  const processChatLine = (chatLine : LichessChatLine) => {
    if (chatLine.username === 'lichess'){
      if (chatLine.text.includes('offers draw') && chatLine.room === 'player'){
        dispatch(addNotificationAction({
          notification: {
            type: 'offer',
            offerType: 'draw',
            status: 'pending',
            ...getMessageCorrespondence(chatLine,homeColor,game as Game),
            id: new Date().getTime().toString(),
            timestamp: toISODateTime(new Date()) 
          },
        }))
      }
      if (chatLine.text.includes('Takeback') && chatLine.room === 'player'){
        if (chatLine.text.includes('sent')){
        dispatch(addNotificationAction({
          notification: {
            offerType: 'takeback',
            type: 'offer',
            status: 'pending',
            ...getMessageCorrespondence(chatLine, homeColor, game as Game),
            id: new Date().getTime().toString(),
            timestamp: toISODateTime(new Date())
          }
        }))
        }
        if (chatLine.text.includes('cancelled')){
          const id = getTakebackNotificationId(activitLog);
          if (id){
            dispatch(resolveOfferNotificationAction({
              notificationId: id,
              status: 'withdrawn'
            }))
          }
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
