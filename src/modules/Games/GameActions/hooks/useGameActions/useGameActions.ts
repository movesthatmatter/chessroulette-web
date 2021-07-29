import { ChessGameColor, ChessHistory, ChessMove } from 'dstnd-io';
import { gameActionPayloads } from './payloads';
import { usePeerState } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';
import useInstance from '@use-it/instance';
import { Pubsy } from 'src/lib/Pubsy';
import { Game } from 'src/modules/Games/types';
import { useEffect } from 'react';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';

type EventListeners = {
  onGameUpdated: Game;
};

// TODO: Rename this to useGame as now it's also an event listener
//  could return actions and events or smgth like that
// TODO: Also the action names starting with "on" are misleading as those are
//  simply imperative actions not listeners!
export const useGameActions = () => {
  const peerState = usePeerState();
  const pubsy = useInstance<Pubsy<EventListeners>>(new Pubsy<EventListeners>());

  // Subscribe to Game Updates
  useEffect(() => {
    if (peerState.status === 'open') {
      const unsubscribers = [
        peerState.client.onMessage((payload) => {
          if (payload.kind === 'joinedGameUpdated') {
            pubsy.publish('onGameUpdated', gameRecordToGame(payload.content));
          } else if (payload.kind === 'joinedRoomAndGameUpdated') {
            pubsy.publish('onGameUpdated', gameRecordToGame(payload.content.game));
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [peerState.status]);

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

    onGameUpdatedEventListener: (fn: (g: Game) => void) => pubsy.subscribe('onGameUpdated', fn),
  };
};
