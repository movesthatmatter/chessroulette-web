import { ChessGameColor, ChessHistory, ChessMove } from 'dstnd-io';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';
import { gameActionPayloads } from '../../GameActions/hooks/useGameActions/payloads';

export const getGameActions = (request: SocketClient['send']) => ({
  onJoin: () => {
    request(gameActionPayloads.join());
  },
  onMove: (nextMove: ChessMove, history: ChessHistory, color: ChessGameColor) => {
    request(gameActionPayloads.move(nextMove));

    // Track Game Started for both Colors
    if (
      (color === 'white' && history.length === 1) ||
      (color === 'black' && history.length === 2)
    ) {
      Events.trackGameStarted(color);
    }
  },

  onMoveRelayInput : (nextMove: ChessMove, gameId: string, relayId: string) => {
    request(gameActionPayloads.moveRelayInput(nextMove, gameId, relayId));
  },
  onOfferChallenge: (p: Parameters<typeof gameActionPayloads.offerChallenge>[0]) => {
    request(gameActionPayloads.offerChallenge(p));
  },
  onChallengeAccepted: () => {
    request(gameActionPayloads.acceptChallenge());
  },
  onChallengeDenied: () => {
    request(gameActionPayloads.denyChallenge());
  },

  onOfferDraw: () => {
    request(gameActionPayloads.offerDraw());

    Events.trackDrawOffered();
  },
  onDrawAccepted: () => {
    request(gameActionPayloads.acceptDraw());

    Events.trackDrawAccepted();
  },
  onDrawDenied: () => {
    request(gameActionPayloads.denyDraw());

    Events.trackDrawDenied();
  },

  onResign: () => {
    request(gameActionPayloads.resign());

    Events.trackResigned();
  },
  onAbort: () => {
    request(gameActionPayloads.abort());

    Events.trackAborted();
  },

  onRematchOffer: (p: Parameters<typeof gameActionPayloads.offerRematch>[0]) => {
    request(gameActionPayloads.offerRematch(p));

    Events.trackRematchOffered();
  },
  onRematchAccepted: () => {
    request(gameActionPayloads.acceptRematch());

    Events.trackRematchAccepted();
  },
  onRematchDenied: () => {
    request(gameActionPayloads.denyRematch());

    Events.trackRematchDenied();
  },

  onTakebackOffer: () => {
    request(gameActionPayloads.takebackOffer());
  },

  onTakebackAccepted: () => {
    request(gameActionPayloads.acceptTakeback());
  },

  onTakebackDeny: () => {
    request(gameActionPayloads.denyTakeback());
  },

  onOfferCanceled: () => request(gameActionPayloads.cancelOffer()),

  onTimerFinished: () => request(gameActionPayloads.statusCheck()),

  onGameStatusCheck: () => request(gameActionPayloads.statusCheck()),
});

export type GameActions = ReturnType<typeof getGameActions>;
