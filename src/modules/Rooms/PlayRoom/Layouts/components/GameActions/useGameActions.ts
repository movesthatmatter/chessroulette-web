import { ChessGameColor, ChessHistory, ChessMove } from 'dstnd-io';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { usePeerState } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';

export const useGameActions = () => {
  const peerState = usePeerState();

  const request: SocketClient['send'] = (payload) => {
    // TODO: Look into what to do if not open!
    // THE ui should actually change and not allow interactions, but ideally
    //  the room still shows!
    // TODO: That should actually be somewhere global maybe!
    if (peerState.status === 'open') {
      peerState.client.sendMessage(payload);
    }
  };

  return {
    onMove: (nextMove: ChessMove, history: ChessHistory, color: ChessGameColor) => {
      request(gameActions.move(nextMove));

      // Track Game Started for both Colors
      if (
        (color === 'white' && history.length === 1) ||
        (color === 'black' && history.length === 2)
      ) {
        Events.trackGameStarted(color);
      }
    },

    onOfferChallenge: (p: Parameters<typeof gameActions.offerChallenge>[0]) => {
      request(gameActions.offerChallenge(p));
    },
    onChallengeAccepted: () => {
      request(gameActions.acceptChallenge());
    },
    onChallengeDenied: () => {
      request(gameActions.denyChallenge());
    },

    onOfferDraw: () => {
      request(gameActions.offerDraw());

      Events.trackDrawOffered();
    },
    onDrawAccepted: () => {
      request(gameActions.acceptDraw());

      Events.trackDrawAccepted();
    },
    onDrawDenied: () => {
      request(gameActions.denyDraw());

      Events.trackDrawDenied();
    },

    onResign: () => {
      request(gameActions.resign());

      Events.trackResigned();
    },
    onAbort: () => {
      request(gameActions.abort());

      Events.trackAborted();
    },

    onRematchOffer: (p: Parameters<typeof gameActions.offerRematch>[0]) => {
      request(gameActions.offerRematch(p));

      Events.trackRematchOffered();
    },
    onRematchAccepted: () => {
      request(gameActions.acceptRematch());

      Events.trackRematchAccepted();
    },
    onRematchDenied: () => {
      request(gameActions.denyRematch());

      Events.trackRematchDenied();
    },

    onOfferCanceled: () => request(gameActions.cancelOffer()),

    onTimerFinished: () => request(gameActions.statusCheck()),

    onGameStatusCheck: () => request(gameActions.statusCheck()),
  };
};
