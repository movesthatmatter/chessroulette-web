import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectGame } from "src/modules/Room/RoomActivity/redux/selectors";
import { selectChatHistory } from "src/providers/PeerProvider";
import { useAuthenticatedUserWithLichessAccount } from "src/services/Authentication";
import { console } from "window-or-global";
import { useLichessProvider } from "../../LichessAPI/useLichessProvider"

export const useLichessChatProvider = () => {
  const lichess = useLichessProvider();
  const auth = useAuthenticatedUserWithLichessAccount();
  const chatHistory = useSelector(selectChatHistory);
  const game = useSelector(selectGame);

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
}