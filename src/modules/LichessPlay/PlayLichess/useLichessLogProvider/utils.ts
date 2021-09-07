import { LichessChatLine, LichessDrawOfferLine, LichessSystemChatLines, LichessTakebackOfferLine } from "../../types";

export function isSystemChatLine (line: LichessChatLine) : line is LichessSystemChatLines {
  return line.username === 'lichess';
}

export function isTakebackOffer (line: LichessSystemChatLines) : line is LichessTakebackOfferLine {
  return line.text.split(' ').some(s => s.toLowerCase().includes('takeback'));
}

export function isDrawOffer (line: LichessSystemChatLines) : line is LichessDrawOfferLine {
  return line.text.split(' ').some(s => s.toLowerCase().includes('draw'));
}