import { ChessGameColor } from "dstnd-io";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toISODateTime } from "src/lib/date/ISODateTime";
import { Game } from "src/modules/Games";
import { getPlayerByColor } from "src/modules/Games/Chess/lib";
import { selectGame } from "src/modules/Room/RoomActivity/redux/selectors";
import { addNotificationAction, resolveOfferNotificationAction } from "src/modules/Room/RoomActivityLog/redux/actions";
import { selectCurrentRoomActivityLog } from "src/modules/Room/RoomActivityLog/redux/selectors";
import { selectChatHistory, usePeerState } from "src/providers/PeerProvider";
import { useAuthenticatedUserWithLichessAccount } from "src/services/Authentication";
import { SocketClient } from "src/services/socket/SocketClient";
import { useLichessProvider } from "../../LichessAPI/useLichessProvider"
import { LichessChatLine, LichessGeneralChatLine, LichessSystemChatLines } from "../../types";
import { convertLichessChatLineToChatMessageRecord, filterChatLineMessage, getLastPendingNotificationOfType, getMessageCorrespondence } from "../../utils";
import { isDrawOffer, isSystemChatLine, isTakebackOffer } from "./utils";

export const useLichessLogProvider = (homeColor: ChessGameColor) => {
  const lichess = useLichessProvider();
  const auth = useAuthenticatedUserWithLichessAccount();
  const chatHistory = useSelector(selectChatHistory);
  const game = useSelector(selectGame);
  const [lichessChatLinesLog, setLichessChatLinesLog] = useState<LichessChatLine[]>([]);
  const dispatch = useDispatch();
  const activitLog = useSelector(selectCurrentRoomActivityLog);
  const peerState = usePeerState();

  useEffect(() => {
    if (lichess){
      lichess.onNewChatLine(({ chatLine }) => {
        setLichessChatLinesLog((prev) => [...prev, chatLine]);
      });
    }
  },[lichess])

  useEffect(() => {
    if (lichessChatLinesLog.length > 0) {
      const latest = lichessChatLinesLog[lichessChatLinesLog.length - 1];
      if (isSystemChatLine(latest)){
        processSystemNotification(latest);
      } else {
        processChatLine(latest);
      }
    }
  },[lichessChatLinesLog])

  useEffect(() => {
    if (
      chatHistory && 
      chatHistory.messages.length > 0 && 
      chatHistory.messages[0].fromUserId === auth?.id && 
      lichess && 
      game
      ){
      lichess.sendChatMessage(chatHistory.messages[0].content, game.vendorData?.gameId as string )
    }
  },[chatHistory?.messages])

  const request: SocketClient['send'] = (payload) => {
    if (peerState.status === 'open'){
      peerState.client.sendMessage(payload)
    }
  }

  const processSystemNotification = (line: LichessSystemChatLines) => {
    if (isTakebackOffer(line)){
      const id = getLastPendingNotificationOfType(activitLog, 'takeback');
      if (line.text === 'Takeback accepted' && id) {
          dispatch(
            resolveOfferNotificationAction({
              notificationId: id,
              status: 'accepted'
            })
          )
      }
      if ((line.text.split(' ').some(s => (s.toLowerCase() === 'cancelled' || s.toLowerCase() === 'declined'))) && id){
        dispatch(
          resolveOfferNotificationAction({
            notificationId: id,
            status: 'withdrawn',
          })
        );
      }
      if (line.text === 'Takeback sent' && !id){
        dispatch(
          addNotificationAction({
            notification: {
              offerType: 'takeback',
              type: 'offer',
              status: 'pending',
              byUser: getPlayerByColor(homeColor === 'white' ? 'black' : 'white', (game as Game)['players']).user,
              toUser: getPlayerByColor(homeColor, (game as Game)['players']).user,
              id: new Date().getTime().toString(),
              timestamp: toISODateTime(new Date()),
            },
          })
        );
      }
    } else if (isDrawOffer(line)){
      const id = getLastPendingNotificationOfType(activitLog, 'draw');
      if (line.text === 'Draw offer accepted' && id){
        dispatch(
          resolveOfferNotificationAction({
            notificationId:id,
            status: 'accepted'
          })
        )
        return;
      }
      if ((line.text === 'Black declines draw' || line.text === 'White declines draw') && id){
        dispatch(
          resolveOfferNotificationAction({
            notificationId:id,
            status: 'withdrawn'
          })
        )
        return;
      }
      if (line.text === 'Black offers draw' || line.text === 'White offers draw'){
        dispatch(
          addNotificationAction({
            notification: {
              type: 'offer',
              offerType: 'draw',
              status: 'pending',
              ...getMessageCorrespondence(line.text.split(' ')[0] as ChessGameColor, homeColor, game as Game),
              id: new Date().getTime().toString(),
              timestamp: toISODateTime(new Date()),
            },
          })
        );
      }
    }
  }

  const processChatLine = (chatLine: LichessGeneralChatLine) => {
    if (filterChatLineMessage(chatLine, auth?.externalAccounts.lichess.userId as string)) {
        request({
          kind: 'broadcastChatMessage',
          content: convertLichessChatLineToChatMessageRecord(chatLine)
        })
      }
  }
}