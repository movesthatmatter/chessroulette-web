import { ChessGameColor, ChessHistory, ChessMove } from 'dstnd-io';
import { gameActionPayloads } from './payloads';
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

    onOfferCanceled: () => request(gameActionPayloads.cancelOffer()),

    onTimerFinished: () => request(gameActionPayloads.statusCheck()),

    onGameStatusCheck: () => request(gameActionPayloads.statusCheck()),
  };
};