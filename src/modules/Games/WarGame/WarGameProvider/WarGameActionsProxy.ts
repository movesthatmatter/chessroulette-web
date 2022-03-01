import { ChessGameColor, WarGameHistory, WarGameMove } from 'chessroulette-io';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';
import { warGameActionPayloads } from '../gameActions/payloads';

export const getWarGameActions = (request: SocketClient['send']) => ({
  onJoin: () => {
    request(warGameActionPayloads.join());
  },
  onMove: (nextMove: WarGameMove, history: WarGameHistory, color: ChessGameColor) => {
    request(warGameActionPayloads.move(nextMove));

    // Track Game Started for both Colors
    if (
      (color === 'white' && history.length === 1) ||
      (color === 'black' && history.length === 2)
    ) {
      Events.trackGameStarted(color);
    }
  },

  onOfferChallenge: (p: Parameters<typeof warGameActionPayloads.offerChallenge>[0]) => {
    request(warGameActionPayloads.offerChallenge(p));
  },
  onChallengeAccepted: () => {
    request(warGameActionPayloads.acceptChallenge());
  },
  onChallengeDenied: () => {
    request(warGameActionPayloads.denyChallenge());
  },

  onOfferDraw: ()  => {
    request(warGameActionPayloads.offerDraw());
  },

  onDrawAccepted: () => {
    request(warGameActionPayloads.acceptDraw());
  },

  onDrawDenied: () => {
    request(warGameActionPayloads.denyDraw());
  },

  onResign: () => {
    request(warGameActionPayloads.resign())
  },

  onRematchOffer: (p: Parameters<typeof warGameActionPayloads.offerRematch>[0]) => {
    request(warGameActionPayloads.offerRematch(p))
  },

  onRematchAccepted: () => {
    request(warGameActionPayloads.acceptRematch())
  },

  onRematchDenied: () => {
    request(warGameActionPayloads.denyRematch())
  },

  onTimerFinished: () => request(warGameActionPayloads.statusCheck()),

  onGameStatusCheck: () => request(warGameActionPayloads.statusCheck()),
});

export type WarGameActions = ReturnType<typeof getWarGameActions>;
